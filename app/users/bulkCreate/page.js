"use client"
import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    TextField,
    Grid,
    Snackbar
} from '@mui/material';

const BulkCreateUsers = () => {
    const [users, setUsers] = useState([{ name: '', email: '', password: '' }]);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleAddUser = () => {
        setUsers([...users, { name: '', email: '', password: '' }]);
    };

    const handleChangeUser = (index, event) => {
        const { name, value } = event.target;
        const newUsers = [...users];
        newUsers[index][name] = value;
        setUsers(newUsers);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
    
            const validUsers = users.filter(user => user.name && user.email && user.password);
    
            if (validUsers.length > 0) {
                const response = await axios.post('http://localhost:3001/api/v1/users/bulkCreate', { users: validUsers }, config);
    
                if (response.status === 200) {
                    const { successfulCount } = response.data.message;
                    if (successfulCount > 0) {
                        setMessage(`Usuarios creado, verifica en http://localhost:3000/users`);
                        setOpenSnackbar(true);
                        setUsers([{ name: '', email: '', password: '' }]);
                    } else {
                        setMessage('No se crearon usuarios nuevos.');
                        setOpenSnackbar(true);
                    }
                } else {
                    throw new Error('Error al crear usuarios: ' + response.data.message);
                }
            } else {
                throw new Error('No hay usuarios válidos para crear.');
            }
        } catch (error) {
            console.error('Error al crear usuarios:', error);
            setMessage('Error al crear usuarios: ' + error.message);
            setOpenSnackbar(true);
        }
    };
    
    
    
    
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Crear Usuarios Masivamente</Typography>

            <Grid container spacing={2}>
                {users.map((user, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={4}>
                            <TextField
                                name="name"
                                label="Nombre"
                                variant="outlined"
                                fullWidth
                                value={user.name}
                                onChange={(e) => handleChangeUser(index, e)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                name="email"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                value={user.email}
                                onChange={(e) => handleChangeUser(index, e)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                name="password"
                                label="Contraseña"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={user.password}
                                onChange={(e) => handleChangeUser(index, e)}
                            />
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>

            <Button variant="contained" color="primary" onClick={handleAddUser} style={{ marginTop: '1rem' }}>
                Agregar Usuario
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '1rem', marginLeft: '1rem' }}>
                Crear Usuarios
            </Button>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={message}
            />
        </Container>
    );
};

export default BulkCreateUsers;
