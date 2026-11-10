import { getConnectionWithCharset } from '#config/database';

const STUDY_FIELDS = `
  study_instance_uid AS studyInstanceUid,
  patient_name AS patientName,
  patient_id AS patientId,
  patient_sex AS patientSex,
  study_date AS studyDate,
  study_time AS studyTime,
  accession_number AS accessionNumber,
  study_id AS studyId
`;

class PacsModel {
  static async upsertStudy(meta) {
    return getConnectionWithCharset(async (connection) => {
      await connection.query(
        `INSERT INTO pacs_studies
          (study_instance_uid, patient_name, patient_id, patient_sex, study_date, study_time, accession_number, study_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          patient_name = VALUES(patient_name), patient_id = VALUES(patient_id),
          patient_sex = VALUES(patient_sex), study_date = VALUES(study_date),
          study_time = VALUES(study_time), accession_number = VALUES(accession_number),
          study_id = VALUES(study_id)`,
        [
          meta.studyInstanceUid, meta.patientName, meta.patientId, meta.patientSex,
          meta.studyDate, meta.studyTime, meta.accessionNumber, meta.studyId,
        ]
      );
    });
  }

  static async upsertSeries(meta) {
    return getConnectionWithCharset(async (connection) => {
      await connection.query(
        `INSERT INTO pacs_series (series_instance_uid, study_instance_uid, modality, series_number)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          study_instance_uid = VALUES(study_instance_uid), modality = VALUES(modality),
          series_number = VALUES(series_number)`,
        [meta.seriesInstanceUid, meta.studyInstanceUid, meta.modality, meta.seriesNumber]
      );
    });
  }

  static async upsertInstance(meta, filePath) {
    return getConnectionWithCharset(async (connection) => {
      await connection.query(
        `INSERT INTO pacs_instances
          (sop_instance_uid, series_instance_uid, study_instance_uid, sop_class_uid, instance_number,
           \`rows\`, cols, bits_allocated, transfer_syntax_uid, has_pixel_data, pixel_data_length, file_path, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          series_instance_uid = VALUES(series_instance_uid), study_instance_uid = VALUES(study_instance_uid),
          sop_class_uid = VALUES(sop_class_uid), instance_number = VALUES(instance_number),
          \`rows\` = VALUES(\`rows\`), cols = VALUES(cols), bits_allocated = VALUES(bits_allocated),
          transfer_syntax_uid = VALUES(transfer_syntax_uid), has_pixel_data = VALUES(has_pixel_data),
          pixel_data_length = VALUES(pixel_data_length), file_path = VALUES(file_path), metadata = VALUES(metadata)`,
        [
          meta.sopInstanceUid, meta.seriesInstanceUid, meta.studyInstanceUid, meta.sopClassUid,
          meta.instanceNumber, meta.rows, meta.cols, meta.bitsAllocated, meta.transferSyntaxUid,
          meta.hasPixelData ? 1 : 0, meta.pixelDataLength, filePath, JSON.stringify(meta),
        ]
      );
    });
  }

  static async findStudies({ patientId, modality, studyDate } = {}) {
    return getConnectionWithCharset(async (connection) => {
      let query = `
        SELECT ${STUDY_FIELDS},
          (SELECT GROUP_CONCAT(DISTINCT se.modality) FROM pacs_series se
            WHERE se.study_instance_uid = st.study_instance_uid) AS modalities,
          (SELECT COUNT(*) FROM pacs_series se
            WHERE se.study_instance_uid = st.study_instance_uid) AS numberOfSeries,
          (SELECT COUNT(*) FROM pacs_instances i
            WHERE i.study_instance_uid = st.study_instance_uid) AS numberOfInstances
        FROM pacs_studies st WHERE 1 = 1`;
      const params = [];
      if (patientId) { query += ' AND st.patient_id = ?'; params.push(patientId); }
      if (studyDate) { query += ' AND st.study_date = ?'; params.push(studyDate); }
      if (modality) {
        query += ' AND EXISTS (SELECT 1 FROM pacs_series se WHERE se.study_instance_uid = st.study_instance_uid AND se.modality = ?)';
        params.push(modality);
      }
      query += ' ORDER BY st.created_at DESC, st.id DESC';
      const [rows] = await connection.query(query, params);
      return rows;
    });
  }

  static async findStudy(studyUid) {
    return getConnectionWithCharset(async (connection) => {
      const [rows] = await connection.query(
        `SELECT ${STUDY_FIELDS} FROM pacs_studies st WHERE study_instance_uid = ?`,
        [studyUid]
      );
      return rows.length > 0 ? rows[0] : null;
    });
  }

  static async findSeriesByStudy(studyUid) {
    return getConnectionWithCharset(async (connection) => {
      const [rows] = await connection.query(
        `SELECT series_instance_uid AS seriesInstanceUid, modality, series_number AS seriesNumber,
          (SELECT COUNT(*) FROM pacs_instances i WHERE i.series_instance_uid = se.series_instance_uid) AS numberOfInstances
         FROM pacs_series se WHERE study_instance_uid = ? ORDER BY series_number + 0, id`,
        [studyUid]
      );
      return rows;
    });
  }

  static async findInstancesBySeries(seriesUid) {
    return getConnectionWithCharset(async (connection) => {
      const [rows] = await connection.query(
        'SELECT metadata FROM pacs_instances WHERE series_instance_uid = ? ORDER BY instance_number + 0, id',
        [seriesUid]
      );
      return rows.map((r) => r.metadata);
    });
  }

  static async findInstanceFile(studyUid, sopUid) {
    return getConnectionWithCharset(async (connection) => {
      const [rows] = await connection.query(
        'SELECT file_path FROM pacs_instances WHERE study_instance_uid = ? AND sop_instance_uid = ? LIMIT 1',
        [studyUid, sopUid]
      );
      return rows.length > 0 ? rows[0].file_path : null;
    });
  }

  static async stats() {
    return getConnectionWithCharset(async (connection) => {
      const [rows] = await connection.query(
        `SELECT
          (SELECT COUNT(*) FROM pacs_studies) AS studies,
          (SELECT COUNT(*) FROM pacs_series) AS series,
          (SELECT COUNT(*) FROM pacs_instances) AS instances`
      );
      return rows[0];
    });
  }
}

export default PacsModel;