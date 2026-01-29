-- V5__create_stored_procedure.sql
-- MySQL Stored Procedure migrated from Oracle PROC_BLINK_MYTM

DELIMITER //

-- Drop existing procedure if it exists
DROP PROCEDURE IF EXISTS PROC_BLINK_MYTM //

-- Create the customer update procedure
-- This procedure handles customer data updates in the MySQL database
-- Migrated from Oracle to MySQL syntax
CREATE PROCEDURE PROC_BLINK_MYTM(
    IN p_mobile VARCHAR(15),
    IN p_cnic VARCHAR(15),
    IN p_nok VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_father VARCHAR(100),
    IN p_mother VARCHAR(100),
    IN p_income VARCHAR(50),
    IN p_purpose VARCHAR(50),
    IN p_lat VARCHAR(20),
    IN p_lng VARCHAR(20),
    IN p_request_id BIGINT
)
BEGIN
    DECLARE v_customer_exists INT DEFAULT 0;
    DECLARE v_update_count INT DEFAULT 0;
    DECLARE v_error_msg VARCHAR(500);

    -- Error handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_msg = MESSAGE_TEXT;
        -- Log the error
        INSERT INTO audit_logs (action, entity_type, entity_id, description, created_at)
        VALUES ('PROC_ERROR', 'CustomerUpdateRequest', p_request_id,
                CONCAT('PROC_BLINK_MYTM failed: ', v_error_msg), NOW());
        -- Re-throw the error
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_msg;
    END;

    -- Start transaction
    START TRANSACTION;

    -- Log the procedure call
    INSERT INTO audit_logs (action, entity_type, entity_id, description, created_at)
    VALUES ('PROC_CALLED', 'CustomerUpdateRequest', p_request_id,
            CONCAT('PROC_BLINK_MYTM called for CNIC: ', p_cnic, ', Mobile: ', p_mobile), NOW());

    -- Update the customer_update_requests table with processing result
    UPDATE customer_update_requests
    SET processing_result = CONCAT('Processed via PROC_BLINK_MYTM at ', NOW()),
        db_execution_result = CONCAT(
            'Mobile: ', IFNULL(p_mobile, 'N/A'),
            ', CNIC: ', IFNULL(p_cnic, 'N/A'),
            ', NOK: ', IFNULL(p_nok, 'N/A'),
            ', Email: ', IFNULL(p_email, 'N/A'),
            ', Father: ', IFNULL(p_father, 'N/A'),
            ', Mother: ', IFNULL(p_mother, 'N/A'),
            ', Income: ', IFNULL(p_income, 'N/A'),
            ', Purpose: ', IFNULL(p_purpose, 'N/A'),
            ', Lat: ', IFNULL(p_lat, 'N/A'),
            ', Lng: ', IFNULL(p_lng, 'N/A')
        ),
        status = 'COMPLETED',
        processed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_request_id;

    SET v_update_count = ROW_COUNT();

    -- Log successful completion
    INSERT INTO audit_logs (action, entity_type, entity_id, description, created_at)
    VALUES ('PROC_SUCCESS', 'CustomerUpdateRequest', p_request_id,
            CONCAT('PROC_BLINK_MYTM completed successfully. Rows updated: ', v_update_count), NOW());

    -- Commit the transaction
    COMMIT;

END //

DELIMITER ;
