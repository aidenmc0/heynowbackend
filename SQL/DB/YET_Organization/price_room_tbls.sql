-- =========================================
-- Room Price Control (per-room × per-year × per-month)
-- =========================================

CREATE TABLE price_room_tbls (
    price_room_id     VARCHAR(20)    PRIMARY KEY,
    room_id           VARCHAR(10)    NOT NULL REFERENCES room_tbls(room_id),
    price_year        INTEGER        NOT NULL DEFAULT 2026,
    price_month       INTEGER        NOT NULL CHECK (price_month BETWEEN 1 AND 12),
    workingday_price  NUMERIC(10,2)  NOT NULL DEFAULT 0,
    holiday_price     NUMERIC(10,2)  NOT NULL DEFAULT 0,
    deleteflag        VARCHAR(1)     NOT NULL DEFAULT 'N',
    createdby         VARCHAR(50)    NOT NULL,
    updatedby         VARCHAR(50),
    createdat         TIMESTAMP      NOT NULL DEFAULT NOW(),
    updatedat         TIMESTAMP      NOT NULL DEFAULT NOW(),
    UNIQUE(room_id, price_year, price_month)
);
