use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow, Serialize)]
pub struct Edge {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub source_node_id: Uuid,
    pub target_node_id: Uuid,
    #[sqlx(rename = "type")]
    #[serde(rename = "type")]
    pub edge_type: String,
    pub label: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
