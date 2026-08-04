CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    new_user_id BIGINT;
    i INT;
    pass_hash VARCHAR;
BEGIN
    -- Hash the default password for all users
    pass_hash := crypt('Password@123', gen_salt('bf'));

    -- 1. Insert 5 Universities (trường)
    FOR i IN 1..5 LOOP
        INSERT INTO universities (university_code, university_name, address, email, phone_number, website_url, is_active, is_deleted, created_at, updated_at)
        VALUES (
            'UNI' || LPAD(i::text, 3, '0'),
            'University Name ' || i,
            '123 University Ave, City ' || i,
            'contact@university' || i || '.edu',
            '091000000' || i,
            'https://university' || i || '.edu',
            true,
            false,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END LOOP;

    -- 2. Insert 5 Companies (công ty)
    FOR i IN 1..5 LOOP
        INSERT INTO companies (company_code, company_name, address, email, phone_number, website_url, is_active, is_deleted, is_verified, created_at, updated_at)
        VALUES (
            'COMP' || LPAD(i::text, 3, '0'),
            'Tech Company ' || i,
            '456 Tech Street, District ' || i,
            'info@techcompany' || i || '.com',
            '098000000' || i,
            'https://techcompany' || i || '.com',
            true,
            false,
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END LOOP;

    -- 3. Role_Admin (1 account)
    INSERT INTO users (username, password, full_name, email, phone_number, role, is_active, is_deleted, created_at, updated_at)
    VALUES ('admin', pass_hash, 'System Admin', 'admin@example.com', '0912345678', 'ROLE_ADMIN', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    -- 4. Role_Mentor (3 accounts)
    FOR i IN 1..3 LOOP
        INSERT INTO users (username, password, full_name, email, phone_number, role, is_active, is_deleted, created_at, updated_at)
        VALUES ('mentor_' || i, pass_hash, 'Mentor ' || i, 'mentor' || i || '@example.com', '092000000' || i, 'ROLE_MENTOR', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING user_id INTO new_user_id;

        INSERT INTO mentor (mentor_id, department, academic_rank, position, created_at, updated_at)
        VALUES (new_user_id, 'System Management', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    END LOOP;

    -- 5. Role_UNIVERSITY_REP - đại diện trường (5 accounts)
    FOR i IN 1..5 LOOP
        INSERT INTO users (username, password, full_name, email, phone_number, role, is_active, is_deleted, created_at, updated_at)
        VALUES ('unirep_' || i, pass_hash, 'University Rep ' || i, 'unirep' || i || '@example.com', '093000000' || i, 'ROLE_UNIVERSITY_REP', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING user_id INTO new_user_id;

        INSERT INTO mentor (mentor_id, department, academic_rank, position, created_at, updated_at)
        VALUES (new_user_id, 'IT Faculty', 'Professor', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    END LOOP;

    -- 6. Role_COMPANY_REP - công ty (5 accounts)
    FOR i IN 1..5 LOOP
        INSERT INTO users (username, password, full_name, email, phone_number, role, is_active, is_deleted, created_at, updated_at)
        VALUES ('comprep_' || i, pass_hash, 'Company Rep ' || i, 'comprep' || i || '@example.com', '094000000' || i, 'ROLE_COMPANY_REP', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING user_id INTO new_user_id;

        INSERT INTO mentor (mentor_id, department, academic_rank, position, created_at, updated_at)
        VALUES (new_user_id, 'HR Department', NULL, 'HR Manager', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    END LOOP;

    -- 7. Role_TEACHER - giáo viên (5 accounts)
    FOR i IN 1..5 LOOP
        INSERT INTO users (username, password, full_name, email, phone_number, role, is_active, is_deleted, created_at, updated_at)
        VALUES ('teacher_' || i, pass_hash, 'Teacher ' || i, 'teacher' || i || '@example.com', '095000000' || i, 'ROLE_TEACHER', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING user_id INTO new_user_id;

        INSERT INTO mentor (mentor_id, department, academic_rank, position, created_at, updated_at)
        VALUES (new_user_id, 'Computer Science', 'Lecturer', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    END LOOP;

    -- 8. Role_COMPANY_MENTOR - hướng dẫn công ty (5 accounts)
    FOR i IN 1..5 LOOP
        INSERT INTO users (username, password, full_name, email, phone_number, role, is_active, is_deleted, created_at, updated_at)
        VALUES ('compmntr_' || i, pass_hash, 'Company Mentor ' || i, 'compmntr' || i || '@example.com', '096000000' || i, 'ROLE_COMPANY_MENTOR', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING user_id INTO new_user_id;

        INSERT INTO mentor (mentor_id, department, academic_rank, position, created_at, updated_at)
        VALUES (new_user_id, 'Engineering', NULL, 'Senior Developer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    END LOOP;

    -- 9. Role_STUDENT (30 accounts)
    FOR i IN 1..30 LOOP
        INSERT INTO users (username, password, full_name, email, phone_number, role, is_active, is_deleted, created_at, updated_at)
        VALUES ('student_' || LPAD(i::text, 2, '0'), pass_hash, 'Student ' || LPAD(i::text, 2, '0'), 'student' || LPAD(i::text, 2, '0') || '@example.com', '09700000' || LPAD(i::text, 2, '0'), 'ROLE_STUDENT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING user_id INTO new_user_id;

        INSERT INTO student (student_id, student_code, major, class_room, date_of_birth, address, created_at, updated_at)
        VALUES (new_user_id, 'STU2026' || LPAD(i::text, 2, '0'), 'Software Engineering', 'SE1501', '2003-01-01'::DATE + i, '123 Student Street, City', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    END LOOP;

END $$;
