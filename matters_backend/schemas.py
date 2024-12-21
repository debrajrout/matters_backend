from pydantic import BaseModel
from models import MatterState

# Schema for Matter
class Matter(BaseModel):
    name: str
    state: MatterState = MatterState.GAS  # Default state is GAS
