use serde::Deserialize;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct CreateEdge {
    pub source_node_id: Uuid,
    pub target_node_id: Uuid,
    #[serde(rename = "type", default = "default_edge_type")]
    pub edge_type: String,
    pub label: Option<String>,
}

fn default_edge_type() -> String {
    "RELATES_TO".to_string()
}
