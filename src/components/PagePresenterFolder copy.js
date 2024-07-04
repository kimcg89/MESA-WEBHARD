import React from 'react';
import styles from './PagePresenterFolder.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faFileDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const PagePresenterFolder = ({
    selectedFile,
    fileList,
    handleFileChange,
    handleFileUpload,
    handleFileDelete,
    currentFolder,
    formatBytes,
}) => {
    return (
        <div className={styles.main}>
            <h1>{currentFolder}</h1>
            <form className={styles.uploadForm} onSubmit={handleFileUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" className={styles['folder-button']}>
                    <FontAwesomeIcon icon={faFileUpload} className={styles.icon} />
                    <span>Upload</span>
                </button>
            </form>
            <h2>Uploaded Files</h2>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>이름</th>
                            <th className={styles.th}>크기</th>
                            <th className={styles.th}>파일</th>
                            <th className={styles.th}>업로드 날짜</th>
                            <th className={styles.th}>다운로드</th>
                            <th className={styles.th}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fileList.map((file, index) => (
                            <tr key={index}>
                                <td className={styles.td}>{file?.originalname || 'Unknown'}</td>
                                <td className={styles.td}>{file?.size ? formatBytes(file.size) : '-'}</td>
                                <td className={styles.td}>{file?.originalname ? file.originalname.split('.').pop().toUpperCase() : '-'}</td>
                                <td className={styles.td}>{file?.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : '-'}</td>
                                <td className={styles.td}>
                                    <a href={`http://localhost:3001/download/${currentFolder}/${encodeURIComponent(file?.filename)}`} download>
                                        <FontAwesomeIcon icon={faFileDownload} className={styles.icon} /> Download
                                    </a>
                                </td>
                                <td className={styles.td}>
                                    <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => handleFileDelete(file?.filename)}>
                                        <FontAwesomeIcon icon={faTrashAlt} className={styles.icon} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PagePresenterFolder;
