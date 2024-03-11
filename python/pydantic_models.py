from pydantic import BaseModel


class PaginationRequest(BaseModel):
    page_no: int = 1
    page_size: int = 10
