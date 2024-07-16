"use client"
import React, { useEffect, useState } from 'react';
import { Container, Switch, Grid, Typography, Box, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AuthService from '@/services/AuthService';

const Edit = (props) => {
    const { id } = props.params;

    const [user, setUser] = useState(null);

    const [editedUser, setEditedUser] = useState({
        name: '',
        email: '',
        cellphone: '',
        status: true,
        last_login: ''
    });

    const handleChange = (value, field) => {
        setEditedUser({
            ...editedUser,
            [field]: value
        });
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            const data = await AuthService.updateUser(id, editedUser, token);
            console.log(data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUser = async () => {
            try {
                const data = await AuthService.getUserById(id, token);
                setUser(data);
                setEditedUser({
                    ...data,
                    last_login: data.last_login || ''
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [id]);

    return (
        <Container maxWidth="sm">
            <Box mt={4} p={3} component={Paper}>
                <Typography variant="h4" gutterBottom>
                    Editar Usuario {id}
                </Typography>
                {!user ? (
                    <Typography variant="body1">Cargando...</Typography>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre"
                                name="name"
                                fullWidth
                                variant="outlined"
                                value={editedUser.name}
                                onChange={(e) => handleChange(e.target.value, 'name')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                fullWidth
                                variant="outlined"
                                value={editedUser.email}
                                onChange={(e) => handleChange(e.target.value, 'email')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Celular"
                                name="cellphone"
                                fullWidth
                                variant="outlined"
                                value={editedUser.cellphone}
                                onChange={(e) => handleChange(e.target.value, 'cellphone')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Última sesión"
                                name="last_login"
                                fullWidth
                                variant="outlined"
                                value={editedUser.last_login || 'TBD'}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Switch
                                name="status"
                                checked={editedUser.status}
                                onChange={(e) => handleChange(e.target.checked, 'status')}
                            />
                            <Typography variant="body1">Activo</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button onClick={handleUpdate} variant="contained" color="primary">
                                Actualizar
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default Edit;
