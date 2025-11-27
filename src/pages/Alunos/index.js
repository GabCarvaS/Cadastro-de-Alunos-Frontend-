import React, { useState, useEffect } from "react";
import './styles.css';
import { Link } from 'react-router-dom';
import logoCadastro from '../../assets/cadastro1.png';
import { FiEdit, FiUserX, FiXCircle } from "react-icons/fi";
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';


export default function Alunos() {

    const [searchInput, setSearchInput] = useState('');
    const [filtro, setFiltro] = useState([]);

    const [alunos, setAlunos] = useState([]);

    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('userToken');

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    const searchAlunos = (searchValue) => {
        setSearchInput(searchValue);
        if (searchInput !== '') {
            const dadosFiltrados = alunos.filter((aluno) => {
                return Object.values(aluno).join('').toLowerCase().includes(searchInput.toLowerCase());
            });
            setFiltro(dadosFiltrados);
        }
        else {
            setFiltro(alunos);
        }
    }

    useEffect(() => {
        api.get('api/alunos', authorization)
            .then(response => {
                setAlunos(response.data);
                setFiltro(response.data);
            })
            .catch(error => {
                alert('Erro ao buscar alunos');
                console.error("Erro ao buscar alunos:", error);
            });
    }, []);

    const navigate = useNavigate();

    async function logout() {
        try {
            localStorage.clear();
            localStorage.setItem('userToken', '');
            authorization.headers = '';
            navigate('/');
        }
        catch (err) {
            alert('Erro ao fazer logout, tente novamente.');
        }
    }

    async function editAluno(id) {
        try {
            navigate(`/aluno/novo/${id}`);
        }
        catch (err) {
            alert('Erro ao editar aluno, tente novamente.');
        }
    }

    async function deleteAluno(id, nome) {
        try {
            if (window.confirm('Tem certeza que deseja deletar o(a) aluno(a) ' + nome + ' com ID = ' + id + '?')) {
                await api.delete(`api/alunos/${id}`, authorization);
                setAlunos(alunos.filter(aluno => aluno.id !== id));
            }
        }
        catch (err) {
            alert('Erro ao deletar aluno, tente novamente.');
        }
    }

    return (
        <div className="aluno-container">
            <header>
                <img src={logoCadastro} alt="Cadastro" />
                <span>Bem-Vindo, <strong>{email}</strong>!</span>
                <Link className="button" to="/aluno/novo/0">Novo aluno</Link>
                <button type="button" onClick={logout}>
                    <FiXCircle size="35" color="#17202a" />
                </button>
            </header>
            <form>
                <input type='text' placeholder="Filtrar por nome..." onChange={(e) => searchAlunos(e.target.value)} />
            </form>
            <h1>Relação de Alunos</h1>
            {searchInput.length > 1 ? (
                <ul>
                    {filtro.map(aluno => (
                        <li key={aluno.id}>
                            <b>Nome:</b>{aluno.nome}<br></br>
                            <b>E-mail:</b>{aluno.email}<br></br>
                            <b>Idade:</b>{aluno.idade}<br></br>
                            <button type="button" onClick={() => editAluno(aluno.id)}>
                                <FiEdit size={25} color="#17202a" />
                            </button>
                            <button type="button" onClick={() => deleteAluno(aluno.id, aluno.nome)}>
                                <FiUserX size={25} color="#17202a" />
                            </button>
                        </li>
                    ))}
                </ul>
            )
                : (
                    <ul>
                        {alunos.map(aluno => (
                            <li key={aluno.id}>
                                <b>Nome:</b>{aluno.nome}<br></br>
                                <b>E-mail:</b>{aluno.email}<br></br>
                                <b>Idade:</b>{aluno.idade}<br></br>
                                <button type="button" onClick={() => editAluno(aluno.id)}>
                                    <FiEdit size={25} color="#17202a" />
                                </button>
                                <button type="button" onClick={() => deleteAluno(aluno.id, aluno.nome)}>
                                    <FiUserX size={25} color="#17202a" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    );
}