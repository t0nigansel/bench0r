use axum::{
    extract::{Path, State},
    routing::{delete, get, post, put},
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::AppError;
use crate::models::node::Node;
use crate::models::node_property::NodeProperty;
use crate::schemas::node::{CreateNode, UpdateNode};

const VALID_NODE_TYPES: &[&str] = &["AGENT", "DATASOURCE", "TOOL", "RULE"];

async fn create_node(
    State(pool): State<PgPool>,
    Path(workspace_id): Path<Uuid>,
    Json(body): Json<CreateNode>,
) -> Result<Json<Node>, AppError> {
    if !VALID_NODE_TYPES.contains(&body.node_type.as_str()) {
        return Err(AppError::BadRequest(format!(
            "Invalid node type '{}'. Must be one of: {}",
            body.node_type,
            VALID_NODE_TYPES.join(", ")
        )));
    }

    sqlx::query("SELECT id FROM workspaces WHERE id = $1")
        .bind(workspace_id)
        .fetch_one(&pool)
        .await
        .map_err(|_| AppError::NotFound(format!("Workspace {workspace_id} not found")))?;

    let id = Uuid::new_v4();
    let node = sqlx::query_as::<_, Node>(
        "INSERT INTO nodes (id, workspace_id, type, label, x_position, y_position, width, height) \
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    )
    .bind(id)
    .bind(workspace_id)
    .bind(&body.node_type)
    .bind(&body.label)
    .bind(body.x_position)
    .bind(body.y_position)
    .bind(body.width)
    .bind(body.height)
    .fetch_one(&pool)
    .await?;

    Ok(Json(node))
}

async fn update_node(
    State(pool): State<PgPool>,
    Path((_workspace_id, node_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<UpdateNode>,
) -> Result<Json<Node>, AppError> {
    let node = sqlx::query_as::<_, Node>(
        "UPDATE nodes SET \
         label = COALESCE($2, label), \
         x_position = COALESCE($3, x_position), \
         y_position = COALESCE($4, y_position), \
         width = COALESCE($5, width), \
         height = COALESCE($6, height), \
         updated_at = now() \
         WHERE id = $1 RETURNING *",
    )
    .bind(node_id)
    .bind(&body.label)
    .bind(body.x_position)
    .bind(body.y_position)
    .bind(body.width)
    .bind(body.height)
    .fetch_one(&pool)
    .await?;

    Ok(Json(node))
}

async fn delete_node(
    State(pool): State<PgPool>,
    Path((_workspace_id, node_id)): Path<(Uuid, Uuid)>,
) -> Result<Json<serde_json::Value>, AppError> {
    let result = sqlx::query("DELETE FROM nodes WHERE id = $1")
        .bind(node_id)
        .execute(&pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Node {node_id} not found")));
    }

    Ok(Json(serde_json::json!({ "deleted": true })))
}

// --- Node Properties ---

#[derive(serde::Deserialize)]
struct UpsertNodeProperty {
    key: String,
    value: String,
    value_type: Option<String>,
}

async fn upsert_node_property(
    State(pool): State<PgPool>,
    Path((_workspace_id, node_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<UpsertNodeProperty>,
) -> Result<Json<NodeProperty>, AppError> {
    // Verify node exists
    sqlx::query("SELECT id FROM nodes WHERE id = $1")
        .bind(node_id)
        .fetch_one(&pool)
        .await
        .map_err(|_| AppError::NotFound(format!("Node {node_id} not found")))?;

    let value_type = body.value_type.unwrap_or_else(|| "string".to_string());

    let prop = sqlx::query_as::<_, NodeProperty>(
        "INSERT INTO node_properties (id, node_id, key, value, value_type) \
         VALUES ($1, $2, $3, $4, $5) \
         ON CONFLICT ON CONSTRAINT node_properties_unique_key_per_node \
         DO UPDATE SET value = EXCLUDED.value, value_type = EXCLUDED.value_type, updated_at = now() \
         RETURNING *",
    )
    .bind(Uuid::new_v4())
    .bind(node_id)
    .bind(&body.key)
    .bind(&body.value)
    .bind(&value_type)
    .fetch_one(&pool)
    .await?;

    Ok(Json(prop))
}

async fn list_node_properties(
    State(pool): State<PgPool>,
    Path((_workspace_id, node_id)): Path<(Uuid, Uuid)>,
) -> Result<Json<Vec<NodeProperty>>, AppError> {
    let props = sqlx::query_as::<_, NodeProperty>(
        "SELECT * FROM node_properties WHERE node_id = $1 ORDER BY key",
    )
    .bind(node_id)
    .fetch_all(&pool)
    .await?;

    Ok(Json(props))
}

async fn delete_node_property(
    State(pool): State<PgPool>,
    Path((_workspace_id, _node_id, prop_id)): Path<(Uuid, Uuid, Uuid)>,
) -> Result<Json<serde_json::Value>, AppError> {
    sqlx::query("DELETE FROM node_properties WHERE id = $1")
        .bind(prop_id)
        .execute(&pool)
        .await?;

    Ok(Json(serde_json::json!({ "deleted": true })))
}

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/api/workspaces/{workspace_id}/nodes", post(create_node))
        .route(
            "/api/workspaces/{workspace_id}/nodes/{node_id}",
            put(update_node).delete(delete_node),
        )
        .route(
            "/api/workspaces/{workspace_id}/nodes/{node_id}/properties",
            get(list_node_properties).post(upsert_node_property),
        )
        .route(
            "/api/workspaces/{workspace_id}/nodes/{node_id}/properties/{prop_id}",
            delete(delete_node_property),
        )
}
