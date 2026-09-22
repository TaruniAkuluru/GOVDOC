from fastapi import APIRouter
from backend.database import get_db_connection

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "healthy"}


@router.get("/departments")
def get_departments():
    connection = get_db_connection()

    if connection is None:
        return {"message": "Database connection failed"}

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, name, description
        FROM departments
        ORDER BY id
    """)

    departments = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "departments": departments
    }

@router.get("/services")
def get_services():
    connection = get_db_connection()

    if connection is None:
        return {"message": "Database connection failed"}

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            services.id,
            services.name,
            services.description,
            departments.name AS department
        FROM services
        JOIN departments
            ON services.department_id = departments.id
        ORDER BY services.id
    """)

    services = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "services": services
    }
@router.get("/services/{service_id}/documents")
def get_required_documents(service_id: int):
    connection = get_db_connection()

    if connection is None:
        return {"message": "Database connection failed"}

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            document_name,
            description,
            mandatory
        FROM required_documents
        WHERE service_id = %s
        ORDER BY id
    """, (service_id,))

    documents = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "service_id": service_id,
        "required_documents": documents
    }

@router.get("/services/{service_id}/office")
def get_office_details(service_id: int):
    connection = get_db_connection()

    if connection is None:
        return {"message": "Database connection failed"}

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            office_name,
            counter,
            address,
            working_hours
        FROM office_details
        WHERE service_id = %s
    """, (service_id,))

    office = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "service_id": service_id,
        "office_details": office
    }
@router.get("/services/{service_id}/instructions")
def get_instructions(service_id: int):
    connection = get_db_connection()

    if connection is None:
        return {"message": "Database connection failed"}

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            instruction
        FROM instructions
        WHERE service_id = %s
        ORDER BY id
    """, (service_id,))

    instructions = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "service_id": service_id,
        "instructions": instructions
    }

@router.get("/services/{service_id}/checklist")
def get_service_checklist(service_id: int):
    connection = get_db_connection()

    if connection is None:
        return {"message": "Database connection failed"}

    cursor = connection.cursor(dictionary=True)

    # Get service information
    cursor.execute("""
        SELECT
            services.id,
            services.name,
            services.description,
            departments.name AS department
        FROM services
        JOIN departments
            ON services.department_id = departments.id
        WHERE services.id = %s
    """, (service_id,))

    service = cursor.fetchone()

    if service is None:
        cursor.close()
        connection.close()

        return {
            "message": "Service not found"
        }

    # Get required documents
    cursor.execute("""
        SELECT
            id,
            document_name,
            description,
            mandatory
        FROM required_documents
        WHERE service_id = %s
        ORDER BY id
    """, (service_id,))

    documents = cursor.fetchall()

    # Get office details
    cursor.execute("""
        SELECT
            id,
            office_name,
            counter,
            address,
            working_hours
        FROM office_details
        WHERE service_id = %s
    """, (service_id,))

    office = cursor.fetchall()

    # Get instructions
    cursor.execute("""
        SELECT
            id,
            instruction
        FROM instructions
        WHERE service_id = %s
        ORDER BY id
    """, (service_id,))

    instructions = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "service": service,
        "required_documents": documents,
        "office_details": office,
        "instructions": instructions
    }