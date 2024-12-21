from enum import Enum

# Enum for Matter States
class MatterState(str, Enum):
    GAS = "gas"
    LIQUID = "liquid"
    SOLID = "solid"
