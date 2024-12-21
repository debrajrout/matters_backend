from fastapi import APIRouter, HTTPException
from schemas import Matter
from models import MatterState
from database import matters

router = APIRouter(prefix="/matters", tags=["Matters"])

# Add a new matter
@router.post("/")
def add_matter(matter: Matter):
    # Check for duplicate names
    if any(existing_matter.name == matter.name for existing_matter in matters):
        raise HTTPException(status_code=400, detail="Matter name already exists.")
    matters.append(matter)
    return {"message": "Matter added successfully", "matter": matter}

# List all matters
@router.get("/")
def list_matters():
    return matters

# Convert matter state in sequence: GAS -> LIQUID -> SOLID
@router.put("/{matter_name}/convert")
def convert_matter(matter_name: str):
    for matter in matters:
        if matter.name == matter_name:
            if matter.state == MatterState.GAS:
                matter.state = MatterState.LIQUID
                return {"message": f"Matter '{matter_name}' converted to LIQUID."}
            elif matter.state == MatterState.LIQUID:
                matter.state = MatterState.SOLID
                return {"message": f"Matter '{matter_name}' converted to SOLID."}
            elif matter.state == MatterState.SOLID:
                raise HTTPException(status_code=400, detail="SOLID state cannot be converted further.")
    raise HTTPException(status_code=404, detail="Matter not found.")

# Delete a matter
@router.delete("/{matter_name}")
def delete_matter(matter_name: str):
    for matter in matters:
        if matter.name == matter_name:
            matters.remove(matter)
            return {"message": f"Matter '{matter_name}' deleted successfully."}
    raise HTTPException(status_code=404, detail="Matter not found.")