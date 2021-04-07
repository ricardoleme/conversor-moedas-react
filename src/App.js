import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import conversor from '../src/images/conversor.png'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'

const App = () => {
    const [obtendoCotacao, setObtendoCotacao] = useState(false)
    const [dados, setDados] = useState([])
    const [valorOrigem, setValorOrigem] = useState(1000)
    const [valorDestino, setValorDestino] = useState('')
    const [dataAtualizacao, setDataAtualizacao] = useState('')
    const [moeda, setMoeda] = useState('')

    useEffect(() => {
        document.title = "Fatec Currency"
        obtemCotacao()
    }, [])

    useEffect(() => {
        converteMoeda()
    }, [moeda, valorOrigem])

    async function obtemCotacao() {
        setObtendoCotacao(true)
        let url = `https://economia.awesomeapi.com.br/json/all`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setDados(data)
            })
            .catch(function (error) {
                console.error('Houve um problema ao efetuar a requisição: ' + error.message);
            });
        setObtendoCotacao(false)
    }

    function converteMoeda() {
        let conversao = moeda ? valorOrigem / dados[moeda]['ask'] : 0
        let atualizacao = moeda ? new Date(dados[moeda]['timestamp'] * 1000).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'Sem dados'
        setValorDestino(conversao.toFixed(2))
        setDataAtualizacao(atualizacao)
    }

    return (
        <Container fluid>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Fatec Currency</Navbar.Brand>
            </Navbar>
            <Row>
                <Col lg={6} xs={12} md={4} sm={4} >
                    {/* Formulário */}
                    <h4 className="text-info">Conversão de Moedas</h4>
                    {obtendoCotacao && <Spinner animation="border" role="status"></Spinner>}
                    <Form>
                        <Form.Group>
                            <Form.Label>Valor a ser convertido em R$:</Form.Label>
                            <Form.Control type="number" value={valorOrigem} onChange={e => setValorOrigem(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Moeda Destino:</Form.Label>
                            <Form.Control as="select" value={moeda} onChange={e => {
                                setMoeda(e.target.value)
                                converteMoeda(e)
                            }
                            }>
                                <option value="">Selecione...</option>
                                <option value="USD">Dólar</option>
                                <option value="EUR">Euro</option>
                                <option value="CAD">Dólar Canadense</option>
                                <option value="GBP">Libra Esterlina</option>
                                <option value="EUR">Euro</option>
                                <option value="BTC">Bitcoin</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Valor convertido:</Form.Label>
                            <Form.Control type="text" readOnly value={valorDestino} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Última Atualização:</Form.Label>
                            <Form.Control type="text" readOnly value={dataAtualizacao} />
                        </Form.Group>
                    </Form>
                </Col>
                <Col lg={6} xs={12}>
                    {/* Imagem */}
                    <h4>Converta gratuitamente</h4>
                    <img src={conversor} title="Conversor de Moedas" alt="Conversor de Moedas" />
                </Col>
            </Row>
        </Container>
    )
}

export default App