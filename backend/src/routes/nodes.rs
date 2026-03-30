use axum::{
    extract::{Path, State},
    routing::post,
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::AppError;
use crate::models::node::Node;
use crate::schemas::node::CreateNode;

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

    // Verify workspace exists
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

pub fn router() -> Router<PgPool> {
    Router::new().route("/api/workspaces/{workspace_id}/nodes", post(create_node))
}
