USE [IT_MIS]
GO
/****** Object:  StoredProcedure [dbo].[sp_getEquipmentList]    Script Date: 27-04-2026 1:08:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_getEquipmentList]
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SearchTerm NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- ==========================================
    -- 1. ส่งคืน Total Count (สำหรับสร้าง Pagination Bar หน้าบ้าน)
    -- ==========================================
    SELECT COUNT(*) AS TotalCount
    FROM IT_MIS.dbo.eqp_tbls e
    WHERE e.[delete] = 'N'
      AND (
            @SearchTerm IS NULL
            OR e.eqp_code LIKE '%' + @SearchTerm + '%'
            OR e.eqp_serial LIKE '%' + @SearchTerm + '%'
          );

    -- ==========================================
    -- 2. ส่งคืนข้อมูล (Data)
    -- ==========================================
    SELECT
        /* ================= Equipment ================= */
        e.eqp_code        AS EqpCode,
        e.eqp_asset       AS EqpAsset,
        e.eqp_serial      AS EqpSerial,
        e.eqp_brand       AS EqpBrand,
        e.eqp_serie       AS EqpSerie,
        e.eqp_detail      AS EqpDetail,
        e.eqp_ip          AS EqpIp,
        e.eqp_status      AS EqpStatus,
        e.[delete]        AS DeleteFlag,
        e.createdBy       AS CreatedBy,
        e.updatedBy       AS UpdatedBy,
        e.createdAt       AS CreatedAt,
        e.updatedAt       AS UpdatedAt,

        /* ================= Type Equipment ================= */
        e.typ_eqp_code    AS TypEqpCode,
        t.typ_eqp_name    AS TypEqpName,

        /* ================= Purchase ================= */
        e.pur_code        AS PurCode,
        p.pur_detail      AS PurDetail,
        p.pur_file        AS PurFile,
        p.pur_price       AS PurPrice,
        p.pur_pr          AS PurPr,
        p.pur_prLink      AS PurPrLink,
        p.pur_po          AS PurPo,
        p.pur_poFile      AS PurPoFile,
        p.pur_receiver    AS PurReceiver,
        p.pur_receiveIMG  AS PurReceiveIMG,
        p.pur_receiveDate AS PurReceiveDate,
        p.pur_status      AS PurStatus,

        /* ================= Employee (YET_Organization) ================= */
        p.emp_code        AS EmpCode,
        pe.dep_code       AS DepCode,
        ped.dep_full      AS DepFull,
        ped.dep_short     AS DepShort,
        pe.emp_img        AS EmpImg,
        pe.emp_type       AS EmpType,
        pe.emp_prefix     AS EmpPrefix,
        pe.emp_name       AS EmpName,
        pe.emp_surname    AS EmpSurname,
        pe.emp_position   AS EmpPosition,
        pe.emp_email      AS EmpEmail,

        /* ========== Flow ========== */
        p.flw_code                AS FlwCode,
        pf.flw_issuedDate         AS FlwIssuedDate,
        pf.flw_needDate           AS FlwNeedDate,
        pf.flw_review1            AS FlwReview1,
        pf.flw_review1Date        AS FlwReview1Date,
        pf.flw_review2            AS FlwReview2,
        pf.flw_review2Date        AS FlwReview2Date,
        pf.flw_review3            AS FlwReview3,
        pf.flw_review3Date        AS FlwReview3Date,
        pf.flw_itReview           AS FlwItReview,
        pf.flw_itReviewDate       AS FlwItReviewDate,
        pf.flw_itApprove          AS FlwItApprove,
        pf.flw_itApproveDate      AS FlwItApproveDate,
        pf.flw_userResponse       AS FlwUserResponse,
        pf.flw_userResponseDate   AS FlwUserResponseDate,
        pf.flw_ppsResponse        AS FlwPpsResponse,
        pf.flw_ppsResponseDate    AS FlwPpsResponseDate,
        pf.flw_itResponse         AS FlwItResponse,
        pf.flw_itResponseDate     AS FlwItResponseDate,
        pf.flw_confirm            AS FlwConfirm,
        pf.flw_confirmDate        AS FlwConfirmDate,

        /* ========== Vendor ========== */
        p.vdr_code        AS VdrCode,
        pv.vdr_company    AS VdrCompany,
        pv.vdr_name       AS VdrName,
        pv.vdr_contact    AS VdrContact,
        pv.vdr_detail     AS VdrDetail,
        pv.vdr_rating     AS VdrRating

    FROM IT_MIS.dbo.eqp_tbls e

    LEFT JOIN IT_MIS.dbo.typ_eqp_tbls t ON e.typ_eqp_code = t.typ_eqp_code
    LEFT JOIN IT_MIS.dbo.pur_tbls p     ON e.pur_code = p.pur_code

    LEFT JOIN YET_Organization.dbo.emp_tbls pe ON p.emp_code = pe.emp_code
    LEFT JOIN YET_Organization.dbo.dep_tbls ped ON pe.dep_code = ped.dep_code

    LEFT JOIN IT_MIS.dbo.flw_tbls pf ON p.flw_code = pf.flw_code
    LEFT JOIN IT_MIS.dbo.vdr_tbls pv ON p.vdr_code = pv.vdr_code

    WHERE e.[delete] = 'N'
      AND (
            @SearchTerm IS NULL
            OR e.eqp_code LIKE '%' + @SearchTerm + '%'
            OR e.eqp_serial LIKE '%' + @SearchTerm + '%'
          )

    ORDER BY e.eqp_code
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;