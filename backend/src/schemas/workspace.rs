use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateWorkspace {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateWorkspace {
    pub name: Option<String>,
    pub description: Option<String>,
}
