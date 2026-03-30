use axum::{
    extract::{Path, State},
    routing::{delete, get, post, put},
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::AppError;
use crate::models::workspace::Workspace;
use crate::schemas::workspace::{CreateWorkspace, UpdateWorkspace};

async fn create_workspace(
    State(pool): State<PgPool>,
    Json(body): Json<CreateWorkspace>,
) -> Result<Json<Workspace>, AppError> {
    let id = Uuid::new_v4();
    let ws = sqlx::query_as::<_, Workspace>(
        "INSERT INTO workspaces (id, name, description) VALUES ($1, $2, $3) RETURNING *",
    )
    .bind(id)
    .bind(&body.name)
    .bind(&body.description)
    .fetch_one(&pool)
    .await?;
    Ok(Json(ws))
}

async fn list_workspaces(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Workspace>>, AppError> {
    let rows = sqlx::query_as::<_, Workspace>(
        "SELECT * FROM workspaces ORDER BY updated_at DESC",
    )
    .fetch_all(&pool)
    .await?;
    Ok(Json(rows))
}

async fn get_workspace(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<Workspace>, AppError> {
    let ws = sqlx::query_as::<_, Workspace>("SELECT * FROM workspaces WHERE id = $1")
        .bind(id)
        .fetch_one(&pool)
        .await?;
    Ok(Json(ws))
}

async fn update_workspace(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateWorkspace>,
) -> Result<Json<Workspace>, AppError> {
    let ws = sqlx::query_as::<_, Workspace>(
        "UPDATE workspaces SET \
         name = COALESCE($2, name), \
         description = COALESCE($3, description), \
         updated_at = now() \
         WHERE id = $1 RETURNING *",
    )
    .bind(id)
    .bind(&body.name)
    .bind(&body.description)
    .fetch_one(&pool)
    .await?;
    Ok(Json(ws))
}

async fn delete_workspace(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    sqlx::query("DELETE FROM workspaces WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;
    Ok(Json(serde_json::json!({ "deleted": true })))
}

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/api/workspaces", get(list_workspaces).post(create_workspace))
        .route(
            "/api/workspaces/{id}",
            get(get_workspace)
                .put(update_workspace)
                .delete(delete_workspace),
        )
}
