use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateNode {
    #[serde(rename = "type")]
    pub node_type: String,
    pub label: String,
    pub x_position: f64,
    pub y_position: f64,
    pub width: Option<f64>,
    pub height: Option<f64>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateNode {
    pub label: Option<String>,
    pub x_position: Option<f64>,
    pub y_position: Option<f64>,
    pub width: Option<f64>,
    pub height: Option<f64>,
}
