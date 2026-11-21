--liquibase formatted sql

--changeset mcv:1
CREATE TABLE service_request (
    id uuid PRIMARY KEY,
    kind varchar(16) NOT NULL CHECK (kind IN ('CONNECTION', 'ISSUE')),
    idempotency_key uuid NOT NULL,
    name varchar(100) NOT NULL,
    phone varchar(16) NOT NULL,
    service varchar(16) NOT NULL CHECK (service IN ('BROADBAND', 'CABLE_TV', 'BOTH')),
    locality varchar(120) NOT NULL,
    details varchar(2000) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (kind, idempotency_key)
);

CREATE TABLE notification_outbox (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_id uuid NOT NULL REFERENCES service_request(id),
    channel varchar(16) NOT NULL CHECK (channel IN ('WHATSAPP', 'SMS')),
    status varchar(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
    attempts integer NOT NULL DEFAULT 0,
    next_attempt_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz,
    UNIQUE (request_id, channel)
);

CREATE INDEX notification_due_idx ON notification_outbox (next_attempt_at, id) WHERE status = 'PENDING';

--changeset mcv:2
UPDATE service_request SET locality = 'Chandanappally' WHERE locality = 'Chandappally';

--changeset mcv:3
ALTER TABLE service_request
    ADD COLUMN reference_number bigint GENERATED ALWAYS AS IDENTITY (START WITH 100001),
    ADD CONSTRAINT service_request_reference_unique UNIQUE (reference_number);

CREATE INDEX service_request_phone_lookup_idx ON service_request (phone, created_at DESC, reference_number DESC);
