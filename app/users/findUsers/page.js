"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Checkbox,
    FormControlLabel,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        login_before_date: '',
        login_after_date: '',
        active: false
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/v1/users/findUsers', {
                    params: {
                        name: filters.name.trim() !== '' ? filters.name.trim() : undefined,
                        login_before_date: filters.login_before_date || undefined,
                        login_after_date: filters.login_after_date || undefined,
                        status: filters.active ? true : undefined
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error al buscar usuarios:', error);
                setUsers([]);
            }
        };

        fetchUsers();
    }, [filters]);

    const handleChangeFilter = (event) => {
        const { name, value, checked, type } = event.target;

        if (type === 'checkbox') {
            setFilters({ ...filters, [name]: checked });
        } else {
            setFilters({ ...filters, [name]: value });
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Filtrar Usuarios</Typography>

            {/* Filtros */}
            <TextField
                label="Nombre"
                name="name"
                variant="outlined"
                value={filters.name}
                onChange={handleChangeFilter}
                fullWidth
                margin="normal"
            />

            <TextField
                label="login_before_date"
                name="login_before_date"
                type="date"
                variant="outlined"
                value={filters.login_before_date}
                onChange={handleChangeFilter}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <TextField
                label="login_after_date"
                name="login_after_date"
                type="date"
                variant="outlined"
                value={filters.login_after_date}
                onChange={handleChangeFilter}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <FormControlLabel
                control={<Checkbox
                    checked={filters.active}
                    onChange={handleChangeFilter}
                    name="active"
                />}
                label="Activo"
            />

            {/* Tabla de usuarios */}
            <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell>login_before_date </TableCell>
                            <TableCell>login_after_date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.filter(user => {
                            // Filtro por nombre (insensible a mayúsculas/minúsculas)
                            const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase());
                            
                            // Filtro por fechas
                            const beforeDateMatch = !filters.login_before_date || (user.createdAt && new Date(user.createdAt) <= new Date(filters.login_before_date));
                            const afterDateMatch = !filters.login_after_date || (user.updatedAt && new Date(user.updatedAt) >= new Date(filters.login_after_date));

                            return nameMatch && beforeDateMatch && afterDateMatch;
                        }).map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.status ? 'Sí' : 'No'}</TableCell>
                                <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</TableCell>
                                <TableCell>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default UserList;
