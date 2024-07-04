import React from 'react';
import styles from './PagePresenter.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderPlus, faTrashAlt, faFileUpload, faFileDownload, faArrowUp, faArrowDown, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const PagePresenter = ({
    selectedFile,
    fileList,
    folders,
    selectedFolders,
    editingFolderId,
    newFolderName,
    handleFileChange,
    handleFileUpload,
    handleFileDelete,
    handleAddFolder,
    handleDeleteSelectedFolders,
    handleFolderCheckboxChange,
    handleFolderDoubleClick,
    handleFolderNameChange,
    handleFolderNameSubmit,
    handleFolderNameClick,
    moveFolder,
    formatBytes,
}) => {
    return (
        <div>
            <div className={styles.navbar}>
                <img src="/images/overview_ci_logo01.png" alt="Logo" className={styles.logo} />
                <div>
                    <a href="#">검색</a>
                    <a href="#">메시지</a>
                    <a href="#">공유자</a>
                    <a href="#">게스트</a>
                    <a href="#">게시판</a>
                    <a href="#">도움말</a>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <div className={styles['folder-actions']}>
                        <button className={styles['folder-button']} onClick={handleAddFolder}>
                            <FontAwesomeIcon icon={faFolderPlus} className={styles.icon} />
                            <span>새폴더</span>
                        </button>
                        <button className={styles['folder-button']} onClick={handleDeleteSelectedFolders}>
                            <FontAwesomeIcon icon={faTrashAlt} className={styles.icon} />
                            <span>삭제</span>
                        </button>
                        <button className={styles['folder-button']} onClick={() => moveFolder(-1)}>
                            <FontAwesomeIcon icon={faArrowUp} className={styles.icon} />
                            <span>위로</span>
                        </button>
                        <button className={styles['folder-button']} onClick={() => moveFolder(1)}>
                            <FontAwesomeIcon icon={faArrowDown} className={styles.icon} />
                            <span>아래로</span>
                        </button>
                    </div>
                    <ul>
                        {folders.map((folder) => (
                            <li key={folder.id} className={selectedFolders.includes(folder.id) ? styles.selected : ''} onClick={() => handleFolderNameClick(folder.id)}>
                                <FontAwesomeIcon icon={faFolder} className={styles.icon} />
                                {editingFolderId === folder.id ? (
                                    <form onSubmit={(e) => handleFolderNameSubmit(e, folder.id)}>
                                        <input 
                                            type="text" 
                                            value={newFolderName} 
                                            onChange={handleFolderNameChange} 
                                            onBlur={(e) => handleFolderNameSubmit(e, folder.id)}
                                            autoFocus 
                                        />
                                    </form>
                                ) : (
                                    <div className={styles['folder-info']} onDoubleClick={() => handleFolderDoubleClick(folder.id, folder.name)}>
                                        <span className={styles['folder-name']}>{folder.name}</span>
                                        <span className={styles['folder-date']}>{new Date(folder.id).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.main}>
                    <h1>File Upload and Download</h1>
                    <form className={styles['upload-form']} onSubmit={handleFileUpload}>
                        <input type="file" id="file-upload" onChange={handleFileChange} />
                        <label htmlFor="file-upload">
                            <FontAwesomeIcon icon={faFileAlt} className={styles.icon} />
                            <span>Select File</span>
                        </label>
                        <div className={styles['file-name-container']}>
                            {selectedFile && (
                                <span className={styles['file-name']}>
                                    {selectedFile.name}
                                </span>
                            )}
                        </div>
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
                                            <a href={`http://localhost:3001/download/${encodeURIComponent(file?.filename)}`} download>
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
            </div>
        </div>
    );
};

export default PagePresenter;
