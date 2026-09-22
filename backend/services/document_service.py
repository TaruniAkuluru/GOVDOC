def process_document(document):
    """
    Basic GovDoc document processing service.
    """

    processed_document = {
        "title": document.title,
        "department": document.department,
        "description": document.description,
        "document_type": document.document_type,
        "status": "received"
    }

    return {
        "message": "Document processed successfully",
        "document": processed_document
    }