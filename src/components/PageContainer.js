import React, { useState, useEffect } from 'react';
import PagePresenter from './PagePresenter';

const PageContainer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolders, setSelectedFolders] = useState([]);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/files')
            .then(response => response.json())
            .then(data => setFileList(data.files));
        
        fetch('http://localhost:3001/folders')
            .then(response => response.json())
            .then(data => setFolders(data.folders));
    }, []);

    const saveFoldersToServer = (folders) => {
        fetch('http://localhost:3001/folders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ folders }),
        });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            console.log("No file selected for upload.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('http://localhost:3001/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            setFileList(prevList => [...prevList, data.file]);
            setSelectedFile(null); // 업로드 후 파일 선택 초기화
        }
    };

    const handleFileDelete = async (filename) => {
        console.log(`Deleting file: ${filename}`);
        const response = await fetch(`http://localhost:3001/delete/${encodeURIComponent(filename)}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setFileList(prevList => prevList.filter(file => file.filename !== filename));
        } else {
            console.error('Failed to delete file');
        }
    };

    const handleAddFolder = () => {
        const newFolder = { name: `폴더${folders.length + 1}`, id: Date.now() };
        const updatedFolders = [...folders, newFolder];
        setFolders(updatedFolders);
        saveFoldersToServer(updatedFolders);
    };

    const handleDeleteSelectedFolders = () => {
        const updatedFolders = folders.filter(folder => !selectedFolders.includes(folder.id));
        setFolders(updatedFolders);
        setSelectedFolders([]);
        saveFoldersToServer(updatedFolders);
    };

    const handleFolderCheckboxChange = (id) => {
        setSelectedFolders(prevSelected =>
            prevSelected.includes(id) ? prevSelected.filter(fid => fid !== id) : [...prevSelected, id]
        );
    };

    const handleFolderDoubleClick = (id, name) => {
        setEditingFolderId(id);
        setNewFolderName(name);
    };

    const handleFolderNameChange = (event) => {
        setNewFolderName(event.target.value);
    };

    const handleFolderNameSubmit = (event, id) => {
        event.preventDefault();
        const updatedFolders = folders.map(folder => 
            folder.id === id ? { ...folder, name: newFolderName } : folder
        );
        setFolders(updatedFolders);
        setEditingFolderId(null);
        saveFoldersToServer(updatedFolders);
    };

    const handleFolderNameClick = (id) => {
        handleFolderCheckboxChange(id);
    };

    const moveFolder = (direction) => {
        if (selectedFolders.length !== 1) return; // 한 번에 하나의 폴더만 이동 가능
        const folderId = selectedFolders[0];
        const index = folders.findIndex(folder => folder.id === folderId);
        if (index === -1) return;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= folders.length) return;

        const newFolders = [...folders];
        const [movedFolder] = newFolders.splice(index, 1);
        newFolders.splice(newIndex, 0, movedFolder);
        setFolders(newFolders);
        saveFoldersToServer(newFolders);
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <PagePresenter
            selectedFile={selectedFile}
            fileList={fileList}
            folders={folders}
            selectedFolders={selectedFolders}
            editingFolderId={editingFolderId}
            newFolderName={newFolderName}
            handleFileChange={handleFileChange}
            handleFileUpload={handleFileUpload}
            handleFileDelete={handleFileDelete}
            handleAddFolder={handleAddFolder}
            handleDeleteSelectedFolders={handleDeleteSelectedFolders}
            handleFolderCheckboxChange={handleFolderCheckboxChange}
            handleFolderDoubleClick={handleFolderDoubleClick}
            handleFolderNameChange={handleFolderNameChange}
            handleFolderNameSubmit={handleFolderNameSubmit}
            handleFolderNameClick={handleFolderNameClick}
            moveFolder={moveFolder}
            formatBytes={formatBytes}
        />
    );
};

export default PageContainer;
