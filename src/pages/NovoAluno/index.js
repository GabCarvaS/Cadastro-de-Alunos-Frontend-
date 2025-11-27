import React, { useEffect, useState } from "react";
import './styles.css';
import { FiCornerDownLeft, FiUser } from "react-icons/fi";
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function NovoAluno() {

    const [id, setId] = React.useState('');
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [idade, setIdade] = React.useState('');

    const navigate = useNavigate();
    const { alunoId } = useParams();

    const token = localStorage.getItem('userToken');

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    useEffect(() => {
        if (alunoId !== '0') {
            loadAluno();
        }
        else {
            return;
        }
    }, alunoId);

    async function loadAluno() {
        try {
            const response = await api.get(`api/alunos/${alunoId}`, authorization);

            setId(response.data.id);
            setNome(response.data.nome);
            setEmail(response.data.email);
            setIdade(response.data.idade);
        }
        catch (err) {
            alert('Erro ao carregar dados do aluno, tente novamente.');
            navigate('/alunos');
        }
    }

    async function saveOrUpdate(event) {
        event.preventDefault();

        const data = {
            nome,
            email,
            idade,
        };

        try {
            if (alunoId === '0') {
                await api.post('api/alunos', data, authorization);
                alert('Aluno incluído com sucesso!');
            }
            else {
                data.id = id;
                await api.put(`api/alunos/${id}`, data, authorization);
                alert('Aluno atualizado com sucesso!');
            }
        }
        catch (err) {
            alert('Erro ao salvar aluno, tente novamente.');
            console.error(err);
        }
        navigate('/alunos');
    }

    return (
        <div className="novo-aluno-container">
            <div className="content">
                <section className="form">
                    <FiUser size={105} color="#17202a" />
                    <h1>{alunoId === '0' ? 'Incluir Novo Aluno' : 'Editar Aluno'}</h1>
                    <Link className="back-link" to="/alunos">
                        <FiCornerDownLeft size={25} color="#17202a" />
                        Retornar
                    </Link>
                </section>
                <form onSubmit={saveOrUpdate}>
                    <input type="text" placeholder="Nome"
                        value={nome} onChange={e => setNome(e.target.value)}
                    />
                    <input type="email" placeholder="Email"
                        value={email} onChange={e => setEmail(e.target.value)}
                    />
                    <input type="text" placeholder="Idade"
                        value={idade} onChange={e => setIdade(e.target.value)}
                    />
                    <button className="button" type="submit">{alunoId === '0' ? 'Incluir' : 'Editar'}</button>
                </form>
            </div>
        </div>
    );
}