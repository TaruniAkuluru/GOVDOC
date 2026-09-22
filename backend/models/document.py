from pydantic import BaseModel
from typing import Optional


class Document(BaseModel):
    title: str
    department: str
    description: Optional[str] = None
    document_type: str