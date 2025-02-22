// MainContent.jsx
import { useState, useEffect, useRef } from 'react';
import { FaFolder, FaFile, FaPlus, FaTrash, FaEdit, FaCheck, FaEllipsisH } from 'react-icons/fa';
import { useFileSystem } from '../contexts/FileSystemContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './MainContent.css';

export default function MainContent() {
    const { fileSystem, createFile, createFolder, deleteItem, renameItem, updateFileContent, currentDirectory, navigateToDirectory } = useFileSystem();
    const [showNewFileDialog, setShowNewFileDialog] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);  // Anchor for the dropdown menu
    const [contextItemId, setContextItemId] = useState(null); // ID of the item for the menu

    const isMenuOpen = Boolean(menuAnchorEl);
    const currentDir = fileSystem[currentDirectory];

    const handleFolderClick = (id) => {
        navigateToDirectory(id);
    };

    const handleCreateFile = () => {
        createFile(newFileName);
        setShowNewFileDialog(false);
        setNewFileName('');
    };

    const handleCreateFolder = () => {
        createFolder(newFolderName);
        setShowNewFolderDialog(false);
        setNewFolderName('');
    };


    const handleUploadFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                createFile(file.name, reader.result); // Store file content as base64
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMenu = (event, itemId) => {
        setContextItemId(itemId);
        setMenuAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
        setContextItemId(null);
    };


    const handleDeleteItem = () => {
        deleteItem(contextItemId);
        handleCloseMenu();
    };

    const handleRenameItem = () => {
        const newName = prompt("Enter new name", fileSystem[contextItemId].name);
        if (newName) {
            renameItem(contextItemId, newName);
        }
        handleCloseMenu();
    };

    return (
        <main className="main-content">
            <div className="files-grid">
                <div className="file-card new-file" onClick={() => setShowNewFileDialog(true)}>
                    <FaPlus className="file-icon" />
                    <span>New file</span>
                </div>
                <div className="file-card new-file" onClick={() => setShowNewFolderDialog(true)}>
                    <FaPlus className="file-icon" />
                    <span>New Folder</span>
                </div>
                <div className="file-card new-file">
                    <label htmlFor="upload-input" style={{ cursor: 'pointer' }}>
                        <FaPlus className="file-icon" />
                        <span>Upload File</span>
                    </label>
                    <input
                        id="upload-input"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleUploadFile}
                    />
                </div>
                {currentDir && currentDir.children && currentDir.children.map(id => {
                    const item = fileSystem[id];
                    if (!item) return null;

                    return (
                        <div className="file-card" key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div onClick={() => item.type === 'folder' ? handleFolderClick(item.id) : setSelectedFile(item)}>
                                    {item.type === 'folder' ? <FaFolder className="file-icon" /> : <FaFile className="file-icon" />}
                                    <span>{item.name}</span>
                                </div>
                                <div>
                                    <Button
                                        onClick={(event) => handleMenu(event, item.id)}
                                    >
                                        <FaEllipsisH />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Dialog open={showNewFileDialog} onClose={() => setShowNewFileDialog(false)}>
                <DialogTitle>Create New File</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="File Name"
                        type="text"
                        fullWidth
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowNewFileDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateFile}>Create</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showNewFolderDialog} onClose={() => setShowNewFolderDialog(false)}>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Folder Name"
                        type="text"
                        fullWidth
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowNewFolderDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateFolder}>Create</Button>
                </DialogActions>
            </Dialog>
            <Menu
                id="basic-menu"
                anchorEl={menuAnchorEl}
                open={isMenuOpen}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleRenameItem}>Rename</MenuItem>
                <MenuItem onClick={handleDeleteItem}>Delete</MenuItem>
            </Menu>
        </main>
    );
}