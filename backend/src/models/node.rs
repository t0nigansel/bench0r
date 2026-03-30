use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow, Serialize)]
pub struct Node {
    pub id: Uuid,
    pub workspace_id: Uuid,
    #[sqlx(rename = "type")]
    #[serde(rename = "type")]
    pub node_type: String,
    pub label: String,
    pub x_position: f64,
    pub y_position: f64,
    pub width: Option<f64>,
    pub height: Option<f64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
