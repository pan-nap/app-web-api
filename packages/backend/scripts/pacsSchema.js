// PACS 持久化表结构（P1）。单一数据源：迁移脚本、initAdmin、测试共用。
// 遵循 DICOM 四级层次中的 Study → Series → Instance；Patient 信息内嵌于 Study。
// 影像原始字节存磁盘（uploads/pacs），此处仅存元数据索引与文件相对路径。
export const pacsTables = [
  {
    name: 'pacs_studies',
    sql: `
      CREATE TABLE IF NOT EXISTS pacs_studies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        study_instance_uid VARCHAR(64) NOT NULL UNIQUE,
        patient_name VARCHAR(255),
        patient_id VARCHAR(64),
        patient_sex VARCHAR(16),
        study_date VARCHAR(8),
        study_time VARCHAR(16),
        accession_number VARCHAR(64),
        study_id VARCHAR(64),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_patient_id (patient_id),
        INDEX idx_study_date (study_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `,
  },
  {
    name: 'pacs_series',
    sql: `
      CREATE TABLE IF NOT EXISTS pacs_series (
        id INT PRIMARY KEY AUTO_INCREMENT,
        series_instance_uid VARCHAR(64) NOT NULL UNIQUE,
        study_instance_uid VARCHAR(64) NOT NULL,
        modality VARCHAR(16),
        series_number VARCHAR(16),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_study (study_instance_uid),
        FOREIGN KEY (study_instance_uid) REFERENCES pacs_studies(study_instance_uid) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `,
  },
  {
    name: 'pacs_instances',
    sql: `
      CREATE TABLE IF NOT EXISTS pacs_instances (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sop_instance_uid VARCHAR(64) NOT NULL UNIQUE,
        series_instance_uid VARCHAR(64) NOT NULL,
        study_instance_uid VARCHAR(64) NOT NULL,
        sop_class_uid VARCHAR(64),
        instance_number VARCHAR(16),
        \`rows\` INT,
        cols INT,
        bits_allocated INT,
        transfer_syntax_uid VARCHAR(64),
        has_pixel_data TINYINT DEFAULT 0,
        pixel_data_length INT DEFAULT 0,
        file_path VARCHAR(255) NOT NULL,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_series (series_instance_uid),
        INDEX idx_study (study_instance_uid),
        FOREIGN KEY (series_instance_uid) REFERENCES pacs_series(series_instance_uid) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `,
  },
  {
    name: 'pacs_annotations',
    sql: `
      CREATE TABLE IF NOT EXISTS pacs_annotations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        annotation_uid VARCHAR(64) NOT NULL UNIQUE,
        study_uid VARCHAR(64) NOT NULL,
        sop_uid VARCHAR(64),
        tool_name VARCHAR(64),
        payload JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_study (study_uid),
        INDEX idx_sop (sop_uid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `,
  },
];