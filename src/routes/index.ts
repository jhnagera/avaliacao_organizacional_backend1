import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { EmpresaController } from '../controllers/EmpresaController';
import { UsuarioController } from '../controllers/UsuarioController';
import { DepartamentoController } from '../controllers/DepartamentoController';
import { QuestionarioController } from '../controllers/QuestionarioController';
import { AvisoController, ReclamacaoController, DenunciaController, ArquivoController } from '../controllers/OutrosControllers';
import { MetadataController } from '../controllers/MetadataController';
import { authMiddleware, isAdmin, isRHorAdmin } from '../middlewares/auth';

const router = Router();

// Controllers
const authController = new AuthController();
const empresaController = new EmpresaController();
const usuarioController = new UsuarioController();
const departamentoController = new DepartamentoController();
const questionarioController = new QuestionarioController();
const avisoController = new AvisoController();
const reclamacaoController = new ReclamacaoController();
const denunciaController = new DenunciaController();
const arquivoController = new ArquivoController();
const metadataController = new MetadataController();

// Rotas públicas
router.get('/metadata/enums', metadataController.getEnums.bind(metadataController));
router.post('/auth/login', authController.login.bind(authController));
router.get('/empresas/public', empresaController.listarPublico.bind(empresaController));
router.post('/denuncias/anonimas', denunciaController.criarAnonimo.bind(denunciaController));

// Rotas autenticadas
router.use(authMiddleware);

// Auth
router.post('/auth/trocar-senha', authController.trocarSenha.bind(authController));

// Empresas (somente admin)
router.post('/empresas', isAdmin, empresaController.criar.bind(empresaController));
router.get('/empresas', isAdmin, empresaController.listar.bind(empresaController));
router.get('/empresas/:id', isAdmin, empresaController.buscarPorId.bind(empresaController));
router.put('/empresas/:id', isAdmin, empresaController.atualizar.bind(empresaController));
router.delete('/empresas/:id', isAdmin, empresaController.deletar.bind(empresaController));

// Usuários (RH e Admin)
router.post('/usuarios', isRHorAdmin, usuarioController.criar.bind(usuarioController));
router.get('/usuarios', isRHorAdmin, usuarioController.listar.bind(usuarioController));
router.get('/usuarios/:id', isRHorAdmin, usuarioController.buscarPorId.bind(usuarioController));
router.put('/usuarios/:id', isRHorAdmin, usuarioController.atualizar.bind(usuarioController));
router.delete('/usuarios/:id', isRHorAdmin, usuarioController.deletar.bind(usuarioController));
router.post('/usuarios/importar', isRHorAdmin, usuarioController.importarPlanilha.bind(usuarioController));

// Departamentos (RH e Admin)
router.post('/departamentos', isRHorAdmin, departamentoController.criar.bind(departamentoController));
router.get('/departamentos', departamentoController.listar.bind(departamentoController));
router.put('/departamentos/:id', isRHorAdmin, departamentoController.atualizar.bind(departamentoController));
router.delete('/departamentos/:id', isRHorAdmin, departamentoController.deletar.bind(departamentoController));

// Questionários
router.post('/questionarios', isRHorAdmin, questionarioController.criar.bind(questionarioController));
router.get('/questionarios', questionarioController.listar.bind(questionarioController));
router.get('/questionarios/:id', questionarioController.buscarPorId.bind(questionarioController));
router.put('/questionarios/:id', isRHorAdmin, questionarioController.atualizar.bind(questionarioController));
router.delete('/questionarios/:id', isRHorAdmin, questionarioController.deletar.bind(questionarioController));
router.get('/questionarios/:id/minhas-respostas', questionarioController.obterMinhasRespostas.bind(questionarioController));
router.post('/questionarios/:id/responder', questionarioController.responder.bind(questionarioController));
router.get('/questionarios/:id/resultados', isRHorAdmin, questionarioController.obterResultados.bind(questionarioController));

// Avisos
router.post('/avisos', isRHorAdmin, avisoController.criar.bind(avisoController));
router.get('/avisos', avisoController.listar.bind(avisoController));
router.put('/avisos/:id', isRHorAdmin, avisoController.atualizar.bind(avisoController));
router.delete('/avisos/:id', isRHorAdmin, avisoController.deletar.bind(avisoController));

// Reclamações e Sugestões
router.post('/reclamacoes', reclamacaoController.criar.bind(reclamacaoController));
router.get('/reclamacoes', reclamacaoController.listar.bind(reclamacaoController));
router.put('/reclamacoes/:id', isRHorAdmin, reclamacaoController.atualizar.bind(reclamacaoController));

// Denúncias
router.post('/denuncias', denunciaController.criar.bind(denunciaController));
router.get('/denuncias', isAdmin, denunciaController.listar.bind(denunciaController));
router.put('/denuncias/:id', isAdmin, denunciaController.atualizar.bind(denunciaController));

// Arquivos
router.get('/arquivos', arquivoController.listar.bind(arquivoController));

export default router;
