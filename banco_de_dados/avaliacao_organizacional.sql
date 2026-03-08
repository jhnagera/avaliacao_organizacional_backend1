--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2026-03-08 19:00:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 49217)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 862 (class 1247 OID 49229)
-- Name: arquivos_tipo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.arquivos_tipo_enum AS ENUM (
    'documento',
    'politica',
    'manual',
    'outro'
);


ALTER TYPE public.arquivos_tipo_enum OWNER TO postgres;

--
-- TOC entry 865 (class 1247 OID 49238)
-- Name: avisos_prioridade_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.avisos_prioridade_enum AS ENUM (
    'baixa',
    'media',
    'alta'
);


ALTER TYPE public.avisos_prioridade_enum OWNER TO postgres;

--
-- TOC entry 868 (class 1247 OID 49246)
-- Name: denuncias_categoria_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.denuncias_categoria_enum AS ENUM (
    'assedio',
    'discriminacao',
    'corrupcao',
    'violacao_codigo',
    'outro'
);


ALTER TYPE public.denuncias_categoria_enum OWNER TO postgres;

--
-- TOC entry 871 (class 1247 OID 49258)
-- Name: denuncias_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.denuncias_status_enum AS ENUM (
    'pendente',
    'em_investigacao',
    'concluido',
    'arquivado'
);


ALTER TYPE public.denuncias_status_enum OWNER TO postgres;

--
-- TOC entry 874 (class 1247 OID 49268)
-- Name: questionarios_destinatario_tipo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.questionarios_destinatario_tipo_enum AS ENUM (
    'todos',
    'departamento',
    'individual'
);


ALTER TYPE public.questionarios_destinatario_tipo_enum OWNER TO postgres;

--
-- TOC entry 877 (class 1247 OID 49276)
-- Name: questionarios_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.questionarios_status_enum AS ENUM (
    'rascunho',
    'ativo',
    'encerrado'
);


ALTER TYPE public.questionarios_status_enum OWNER TO postgres;

--
-- TOC entry 880 (class 1247 OID 49284)
-- Name: questionarios_tipo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.questionarios_tipo_enum AS ENUM (
    'pesquisa_clima',
    'avaliacao_desempenho',
    'feedback',
    'saude_mental',
    'outro'
);


ALTER TYPE public.questionarios_tipo_enum OWNER TO postgres;

--
-- TOC entry 883 (class 1247 OID 49296)
-- Name: questoes_tipo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.questoes_tipo_enum AS ENUM (
    'multipla_escolha',
    'escala',
    'texto_livre',
    'sim_nao'
);


ALTER TYPE public.questoes_tipo_enum OWNER TO postgres;

--
-- TOC entry 886 (class 1247 OID 49306)
-- Name: reclamacoes_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reclamacoes_status_enum AS ENUM (
    'pendente',
    'em_analise',
    'resolvido',
    'rejeitado'
);


ALTER TYPE public.reclamacoes_status_enum OWNER TO postgres;

--
-- TOC entry 889 (class 1247 OID 49316)
-- Name: reclamacoes_tipo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reclamacoes_tipo_enum AS ENUM (
    'reclamacao',
    'sugestao'
);


ALTER TYPE public.reclamacoes_tipo_enum OWNER TO postgres;

--
-- TOC entry 892 (class 1247 OID 49322)
-- Name: usuarios_tipo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usuarios_tipo_enum AS ENUM (
    'admin',
    'rh',
    'colaborador',
    'super_admin'
);


ALTER TYPE public.usuarios_tipo_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 49331)
-- Name: arquivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.arquivos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(255) NOT NULL,
    caminho character varying(255) NOT NULL,
    extensao character varying(50) NOT NULL,
    tamanho bigint NOT NULL,
    tipo public.arquivos_tipo_enum DEFAULT 'documento'::public.arquivos_tipo_enum NOT NULL,
    descricao text,
    empresa_id uuid NOT NULL,
    usuario_upload_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.arquivos OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 49339)
-- Name: avisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avisos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    titulo character varying(200) NOT NULL,
    conteudo text NOT NULL,
    prioridade public.avisos_prioridade_enum DEFAULT 'media'::public.avisos_prioridade_enum NOT NULL,
    data_inicio date,
    data_fim date,
    ativo boolean DEFAULT true NOT NULL,
    empresa_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.avisos OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 49555)
-- Name: contracheques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracheques (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    mes integer NOT NULL,
    ano integer NOT NULL,
    arquivo_url character varying(255) NOT NULL,
    empresa_id uuid NOT NULL,
    usuario_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contracheques OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 49349)
-- Name: denuncias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.denuncias (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    categoria public.denuncias_categoria_enum NOT NULL,
    descricao text NOT NULL,
    status public.denuncias_status_enum DEFAULT 'pendente'::public.denuncias_status_enum NOT NULL,
    observacoes_internas text,
    anonimo boolean DEFAULT true NOT NULL,
    usuario_id uuid,
    empresa_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.denuncias OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 49359)
-- Name: departamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamentos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    ativo boolean DEFAULT true NOT NULL,
    empresa_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.departamentos OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 49368)
-- Name: empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(200) NOT NULL,
    cnpj character varying(18) NOT NULL,
    razao_social character varying(100),
    endereco text,
    telefone character varying(20),
    email character varying(100),
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.empresas OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 49377)
-- Name: opcoes_resposta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.opcoes_resposta (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    texto text NOT NULL,
    valor integer,
    ordem integer NOT NULL,
    questao_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.opcoes_resposta OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 49384)
-- Name: questionarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questionarios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    titulo character varying(200) NOT NULL,
    descricao text,
    status public.questionarios_status_enum DEFAULT 'rascunho'::public.questionarios_status_enum NOT NULL,
    data_inicio date,
    data_fim date,
    anonimo boolean DEFAULT false NOT NULL,
    empresa_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL,
    tipo public.questionarios_tipo_enum DEFAULT 'pesquisa_clima'::public.questionarios_tipo_enum NOT NULL,
    destinatario_tipo public.questionarios_destinatario_tipo_enum DEFAULT 'todos'::public.questionarios_destinatario_tipo_enum NOT NULL,
    departamento_id uuid,
    usuario_id uuid
);


ALTER TABLE public.questionarios OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 49396)
-- Name: questoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questoes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    pergunta text NOT NULL,
    tipo public.questoes_tipo_enum DEFAULT 'multipla_escolha'::public.questoes_tipo_enum NOT NULL,
    obrigatoria boolean DEFAULT false NOT NULL,
    ordem integer NOT NULL,
    questionario_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.questoes OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 49406)
-- Name: reclamacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reclamacoes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tipo public.reclamacoes_tipo_enum DEFAULT 'reclamacao'::public.reclamacoes_tipo_enum NOT NULL,
    titulo character varying(200) NOT NULL,
    descricao text NOT NULL,
    status public.reclamacoes_status_enum DEFAULT 'pendente'::public.reclamacoes_status_enum NOT NULL,
    resposta_rh text,
    anonimo boolean DEFAULT false NOT NULL,
    usuario_id uuid,
    empresa_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reclamacoes OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 49417)
-- Name: respostas_questionario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respostas_questionario (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    questionario_id uuid NOT NULL,
    usuario_id uuid,
    questao_id uuid NOT NULL,
    opcao_id uuid,
    resposta_texto text,
    resposta_valor integer,
    respondido_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.respostas_questionario OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 49424)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(200) NOT NULL,
    email character varying(100) NOT NULL,
    senha character varying(255) NOT NULL,
    cpf character varying(14),
    telefone character varying(20),
    cargo character varying(100),
    tipo public.usuarios_tipo_enum DEFAULT 'colaborador'::public.usuarios_tipo_enum NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    empresa_id uuid NOT NULL,
    departamento_id uuid,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 4963 (class 0 OID 49331)
-- Dependencies: 216
-- Data for Name: arquivos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4964 (class 0 OID 49339)
-- Dependencies: 217
-- Data for Name: avisos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4974 (class 0 OID 49555)
-- Dependencies: 227
-- Data for Name: contracheques; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.contracheques (id, mes, ano, arquivo_url, empresa_id, usuario_id, criado_em) VALUES ('c7c9274f-6ad0-4be6-9051-5c198db67a22', 3, 2026, '1772921672043-279704611.pdf', 'a736b784-ede0-4239-832d-50518514f773', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', '2026-03-07 17:14:32.072035');
INSERT INTO public.contracheques (id, mes, ano, arquivo_url, empresa_id, usuario_id, criado_em) VALUES ('dfeb9e80-58ba-4171-900b-a07d648f1472', 2, 2026, '1772922282223-2643391.pdf', 'a736b784-ede0-4239-832d-50518514f773', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', '2026-03-07 17:24:42.251063');
INSERT INTO public.contracheques (id, mes, ano, arquivo_url, empresa_id, usuario_id, criado_em) VALUES ('c6feab1f-b2af-4a3c-8d91-cc08cde2f600', 1, 2026, '1772922296120-189707813.pdf', 'a736b784-ede0-4239-832d-50518514f773', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', '2026-03-07 17:24:56.144333');
INSERT INTO public.contracheques (id, mes, ano, arquivo_url, empresa_id, usuario_id, criado_em) VALUES ('595d2475-dadb-4a83-9e26-46117b49b1f9', 3, 2026, '1772922855780-936533911.pdf', 'a736b784-ede0-4239-832d-50518514f773', 'ec14d799-942f-46a1-9d49-ae612d2054a4', '2026-03-07 17:34:15.806122');


--
-- TOC entry 4965 (class 0 OID 49349)
-- Dependencies: 218
-- Data for Name: denuncias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.denuncias (id, categoria, descricao, status, observacoes_internas, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('bfb18ba1-4b19-488d-ba3c-ec4760a72b09', 'outro', 'o café é péssimo, vocês deviam ter vergonha de oferecer isso para nós.', 'pendente', NULL, true, NULL, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-26 16:52:30.025388', '2026-02-26 16:52:30.025388');
INSERT INTO public.denuncias (id, categoria, descricao, status, observacoes_internas, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('77061b12-3ada-4a08-9722-a43d96f91551', 'outro', 'nada funciona aqui', 'em_investigacao', '', true, NULL, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-27 13:24:28.736793', '2026-02-27 13:35:24.212111');
INSERT INTO public.denuncias (id, categoria, descricao, status, observacoes_internas, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('72a2cf87-86f9-40a5-a680-580f380747d2', 'outro', 'o café é muito ruim, isso é um absurdo', 'concluido', '', true, NULL, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-27 13:12:30.400352', '2026-02-27 13:35:35.30689');
INSERT INTO public.denuncias (id, categoria, descricao, status, observacoes_internas, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('79c85ff0-e7b3-4fec-b198-6a7ae09c1ab1', 'outro', 'o café é muito ruim, isso é um absurdo', 'arquivado', '', true, NULL, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-27 12:57:42.643331', '2026-02-27 13:35:43.467214');
INSERT INTO public.denuncias (id, categoria, descricao, status, observacoes_internas, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('429b9fc3-ed40-4384-84fb-b20f9de49ab2', 'outro', 'teste', 'pendente', NULL, true, NULL, 'a027a764-7885-487f-8b3e-9bce48e63665', '2026-02-27 13:42:29.422491', '2026-02-27 13:42:29.422491');
INSERT INTO public.denuncias (id, categoria, descricao, status, observacoes_internas, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('0800a5ae-eeb2-40cd-bfc4-809bd4804290', 'outro', 'teste', 'pendente', NULL, true, NULL, '66cc78c5-a31c-4f8f-960f-02fb723967a5', '2026-02-27 13:43:02.577249', '2026-02-27 13:43:02.577249');


--
-- TOC entry 4966 (class 0 OID 49359)
-- Dependencies: 219
-- Data for Name: departamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.departamentos (id, nome, descricao, ativo, empresa_id, criado_em, atualizado_em) VALUES ('6d8e2b54-837e-4451-a9ae-62bfebcd4789', 'TI', '', true, '66cc78c5-a31c-4f8f-960f-02fb723967a5', '2026-02-21 16:27:47.879118', '2026-02-21 16:27:47.879118');
INSERT INTO public.departamentos (id, nome, descricao, ativo, empresa_id, criado_em, atualizado_em) VALUES ('705a69ec-8e63-4554-858f-81f8657d3be9', 'RH', '', true, '66cc78c5-a31c-4f8f-960f-02fb723967a5', '2026-02-21 16:27:58.641378', '2026-02-21 16:27:58.641378');
INSERT INTO public.departamentos (id, nome, descricao, ativo, empresa_id, criado_em, atualizado_em) VALUES ('a08180b4-fa07-40a8-bd02-e75e0fe059c5', 'TI', '', true, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-25 14:11:59.744334', '2026-02-25 14:11:59.744334');
INSERT INTO public.departamentos (id, nome, descricao, ativo, empresa_id, criado_em, atualizado_em) VALUES ('ec1771af-ca71-468a-86ed-c6de7a897c82', 'RH', '', true, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-25 14:12:05.662976', '2026-02-25 14:12:05.662976');
INSERT INTO public.departamentos (id, nome, descricao, ativo, empresa_id, criado_em, atualizado_em) VALUES ('833201b4-e064-4116-91d5-7351807423d1', 'Segurança', '', true, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-26 15:03:09.752029', '2026-02-26 15:03:09.752029');


--
-- TOC entry 4967 (class 0 OID 49368)
-- Dependencies: 220
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.empresas (id, nome, cnpj, razao_social, endereco, telefone, email, ativo, criado_em, atualizado_em) VALUES ('66cc78c5-a31c-4f8f-960f-02fb723967a5', 'Minha Empresa', '00.000.000/0001-00', NULL, NULL, NULL, 'contato@empresa.com', true, '2026-02-21 16:24:52.256705', '2026-02-21 16:24:52.256705');
INSERT INTO public.empresas (id, nome, cnpj, razao_social, endereco, telefone, email, ativo, criado_em, atualizado_em) VALUES ('a027a764-7885-487f-8b3e-9bce48e63665', 'teste', '12312312312', 'nexo', 'rua rio grande, 15245', '5152156231251', 'nexo@gmail.com', true, '2026-02-25 08:24:33.660522', '2026-02-25 08:24:33.660522');
INSERT INTO public.empresas (id, nome, cnpj, razao_social, endereco, telefone, email, ativo, criado_em, atualizado_em) VALUES ('de925259-031c-4c2f-8c69-ba2231ec25aa', 'locadora', '10101010', 'joao', 'rua 1', '5256215', 'locadora@gmail.com', false, '2026-02-25 08:39:10.518351', '2026-02-25 08:48:38.473654');
INSERT INTO public.empresas (id, nome, cnpj, razao_social, endereco, telefone, email, ativo, criado_em, atualizado_em) VALUES ('a736b784-ede0-4239-832d-50518514f773', 'locadora', '2524525', 'joao', 'rua 1', '252445265', 'locadora@gmail.com', true, '2026-02-25 08:49:48.886761', '2026-02-25 08:49:48.886761');


--
-- TOC entry 4968 (class 0 OID 49377)
-- Dependencies: 221
-- Data for Name: opcoes_resposta; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('a3720be9-3b8a-4249-ab27-d81a18c6c7ef', 'sim', 1, 1, 'bfd204e1-f133-44bf-8a02-f8713a5a2955', '2026-02-26 14:01:15.441429');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('f99b7d21-1f96-4976-ab30-15e2081228df', 'não', 2, 2, 'bfd204e1-f133-44bf-8a02-f8713a5a2955', '2026-02-26 14:01:15.441429');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('48f17f27-ee1e-4e4e-bd16-3f4a6a09da49', 'talvez', 3, 3, 'bfd204e1-f133-44bf-8a02-f8713a5a2955', '2026-02-26 14:01:15.441429');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('4a22e471-83d0-4a61-87f8-84d96fda3e1a', 'Sim', 1, 1, '0201c93a-aafd-4992-bcbc-ef78160c0f31', '2026-02-26 14:24:07.039995');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('93b5a688-4d0d-4379-8cc9-f9acb44e81e9', 'Não', 0, 2, '0201c93a-aafd-4992-bcbc-ef78160c0f31', '2026-02-26 14:24:07.039995');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('97522e88-b4e0-4afe-9f0e-ff48621a8bcc', 'Sim', 1, 1, '66a68830-db4c-450f-8100-4ad3201b3c38', '2026-02-26 14:24:07.039995');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('04a014fb-64ed-429d-875e-22118819f599', 'Não', 0, 2, '66a68830-db4c-450f-8100-4ad3201b3c38', '2026-02-26 14:24:07.039995');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('dd0b622b-39b5-4e26-9e3e-c5c10aac11d6', 'sim', 1, 1, '2fdc64d2-6271-463f-b7c6-6abcdc49fda1', '2026-02-26 14:33:18.203002');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('44342e61-6c91-4f81-9b39-4fc248e13d82', 'nao', 2, 2, '2fdc64d2-6271-463f-b7c6-6abcdc49fda1', '2026-02-26 14:33:18.203002');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('b2ad8230-097f-4816-8065-01dd004e0988', 'nao sei', 3, 3, '2fdc64d2-6271-463f-b7c6-6abcdc49fda1', '2026-02-26 14:33:18.203002');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('f09f1c79-5472-49a4-b920-5b38c940bc44', 'Sim', 1, 1, '6d5969f1-a7ee-440f-bac7-3a814f7b59e3', '2026-02-26 15:05:39.865775');
INSERT INTO public.opcoes_resposta (id, texto, valor, ordem, questao_id, criado_em) VALUES ('1f7b6b6c-20ff-486a-b6c1-656fdbc343e9', 'Não', 0, 2, '6d5969f1-a7ee-440f-bac7-3a814f7b59e3', '2026-02-26 15:05:39.865775');


--
-- TOC entry 4969 (class 0 OID 49384)
-- Dependencies: 222
-- Data for Name: questionarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.questionarios (id, titulo, descricao, status, data_inicio, data_fim, anonimo, empresa_id, criado_em, atualizado_em, tipo, destinatario_tipo, departamento_id, usuario_id) VALUES ('d5630166-1536-4fb8-9a03-ec1f0be81fc7', 'teste', 'teste', 'ativo', '2026-02-25', '2026-03-25', false, '66cc78c5-a31c-4f8f-960f-02fb723967a5', '2026-02-25 08:36:35.060469', '2026-02-25 08:36:58.534999', 'pesquisa_clima', 'todos', NULL, NULL);
INSERT INTO public.questionarios (id, titulo, descricao, status, data_inicio, data_fim, anonimo, empresa_id, criado_em, atualizado_em, tipo, destinatario_tipo, departamento_id, usuario_id) VALUES ('fdbd3a4b-9e7b-4fe0-94f7-9b44c4be8b76', 'teste', '', 'ativo', '2026-02-25', '2026-03-25', false, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-25 14:14:20.078761', '2026-02-26 13:45:49.560559', 'pesquisa_clima', 'individual', NULL, '46e3150e-7fbd-4ff4-b083-f3cbb372ca32');
INSERT INTO public.questionarios (id, titulo, descricao, status, data_inicio, data_fim, anonimo, empresa_id, criado_em, atualizado_em, tipo, destinatario_tipo, departamento_id, usuario_id) VALUES ('3d7cdead-5e03-4179-aa86-3903cc36de17', 'teste2', '', 'ativo', '2026-02-26', '2026-03-26', false, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-26 14:33:18.203002', '2026-02-26 14:33:34.732406', 'pesquisa_clima', 'individual', NULL, '46e3150e-7fbd-4ff4-b083-f3cbb372ca32');
INSERT INTO public.questionarios (id, titulo, descricao, status, data_inicio, data_fim, anonimo, empresa_id, criado_em, atualizado_em, tipo, destinatario_tipo, departamento_id, usuario_id) VALUES ('349c5235-08c5-4e13-a409-0da784a50d84', 'teste3', '', 'ativo', '2026-02-26', '2026-03-26', false, 'a736b784-ede0-4239-832d-50518514f773', '2026-02-26 15:05:39.865775', '2026-02-26 15:05:50.833508', 'pesquisa_clima', 'departamento', '833201b4-e064-4116-91d5-7351807423d1', NULL);


--
-- TOC entry 4970 (class 0 OID 49396)
-- Dependencies: 223
-- Data for Name: questoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.questoes (id, pergunta, tipo, obrigatoria, ordem, questionario_id, criado_em, atualizado_em) VALUES ('0201c93a-aafd-4992-bcbc-ef78160c0f31', 'o café é bom?', 'sim_nao', true, 2, 'fdbd3a4b-9e7b-4fe0-94f7-9b44c4be8b76', '2026-02-26 14:01:15.441429', '2026-02-26 14:01:15.441429');
INSERT INTO public.questoes (id, pergunta, tipo, obrigatoria, ordem, questionario_id, criado_em, atualizado_em) VALUES ('bfd204e1-f133-44bf-8a02-f8713a5a2955', 'o verde é bonito?', 'multipla_escolha', true, 1, 'fdbd3a4b-9e7b-4fe0-94f7-9b44c4be8b76', '2026-02-26 14:01:15.441429', '2026-02-26 14:24:07.039995');
INSERT INTO public.questoes (id, pergunta, tipo, obrigatoria, ordem, questionario_id, criado_em, atualizado_em) VALUES ('66a68830-db4c-450f-8100-4ad3201b3c38', 'você gosta daqui?', 'sim_nao', true, 3, 'fdbd3a4b-9e7b-4fe0-94f7-9b44c4be8b76', '2026-02-26 13:45:49.560559', '2026-02-26 14:24:07.039995');
INSERT INTO public.questoes (id, pergunta, tipo, obrigatoria, ordem, questionario_id, criado_em, atualizado_em) VALUES ('dd2d5a21-4c10-4787-9f46-3e3e6c786f02', 'azul é uma cor bonita?', 'texto_livre', true, 3, '3d7cdead-5e03-4179-aa86-3903cc36de17', '2026-02-26 14:33:18.203002', '2026-02-26 14:33:18.203002');
INSERT INTO public.questoes (id, pergunta, tipo, obrigatoria, ordem, questionario_id, criado_em, atualizado_em) VALUES ('2fdc64d2-6271-463f-b7c6-6abcdc49fda1', 'voce gosta daqui?', 'multipla_escolha', true, 1, '3d7cdead-5e03-4179-aa86-3903cc36de17', '2026-02-26 14:33:18.203002', '2026-02-26 14:33:34.732406');
INSERT INTO public.questoes (id, pergunta, tipo, obrigatoria, ordem, questionario_id, criado_em, atualizado_em) VALUES ('489aad7a-a45a-4fbb-a469-6a735f5bfa2b', 'o café é bom?', 'escala', true, 2, '3d7cdead-5e03-4179-aa86-3903cc36de17', '2026-02-26 14:33:18.203002', '2026-02-26 14:33:34.732406');
INSERT INTO public.questoes (id, pergunta, tipo, obrigatoria, ordem, questionario_id, criado_em, atualizado_em) VALUES ('6d5969f1-a7ee-440f-bac7-3a814f7b59e3', 'a segurança funciona aqui?', 'sim_nao', true, 1, '349c5235-08c5-4e13-a409-0da784a50d84', '2026-02-26 15:05:39.865775', '2026-02-26 15:05:39.865775');
INSERT INTO public.questoes (id, pergunta, tipo, obrigatoria, ordem, questionario_id, criado_em, atualizado_em) VALUES ('292d1140-d09d-4a08-b976-740b5725ac33', 'voce gosta daqui?', 'escala', true, 2, '349c5235-08c5-4e13-a409-0da784a50d84', '2026-02-26 15:05:39.865775', '2026-02-26 15:05:39.865775');
INSERT INTO public.questoes (id, pergunta, tipo, obrigatoria, ordem, questionario_id, criado_em, atualizado_em) VALUES ('57a8c13c-66f2-4535-85a9-a557ea2ae381', 'tudo bem com tu?', 'texto_livre', true, 3, '349c5235-08c5-4e13-a409-0da784a50d84', '2026-02-26 15:05:39.865775', '2026-02-26 15:05:39.865775');


--
-- TOC entry 4971 (class 0 OID 49406)
-- Dependencies: 224
-- Data for Name: reclamacoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reclamacoes (id, tipo, titulo, descricao, status, resposta_rh, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('3bd80464-a5ba-468e-8b83-e67a55304c95', 'reclamacao', 'Teste de reclama', 'Esta ', 'pendente', NULL, false, '1e2f1ab3-dde9-4ac7-b5ee-46e393a0c26b', 'a736b784-ede0-4239-832d-50518514f773', '2026-02-27 14:46:11.10871', '2026-02-27 14:46:11.10871');
INSERT INTO public.reclamacoes (id, tipo, titulo, descricao, status, resposta_rh, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('7dbcfa2f-b61d-42f7-8bc3-df28549a6b6a', 'reclamacao', 'Teste de reclamacao v2', 'Esta e uma reclamacao de teste para verificar a funcionalidade sem acentos.', 'pendente', NULL, false, '1e2f1ab3-dde9-4ac7-b5ee-46e393a0c26b', 'a736b784-ede0-4239-832d-50518514f773', '2026-02-27 14:46:44.062848', '2026-02-27 14:46:44.062848');
INSERT INTO public.reclamacoes (id, tipo, titulo, descricao, status, resposta_rh, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('6b510e2f-3a1b-4e35-8ad1-ee3897d384a4', 'reclamacao', 'Teste Debug', 'Descricao de teste', 'pendente', NULL, false, '6d36f380-6c35-48b3-a6bf-cc222d5a4eac', '66cc78c5-a31c-4f8f-960f-02fb723967a5', '2026-02-27 14:49:10.527435', '2026-02-27 14:49:10.527435');
INSERT INTO public.reclamacoes (id, tipo, titulo, descricao, status, resposta_rh, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('91021211-cf4b-46a4-9f23-f4d4a55b09db', 'reclamacao', 'teste', 'teste', 'pendente', NULL, false, 'ec14d799-942f-46a1-9d49-ae612d2054a4', 'a736b784-ede0-4239-832d-50518514f773', '2026-02-27 15:05:07.539301', '2026-02-27 15:05:07.539301');
INSERT INTO public.reclamacoes (id, tipo, titulo, descricao, status, resposta_rh, anonimo, usuario_id, empresa_id, criado_em, atualizado_em) VALUES ('1645382c-3767-4aa4-a15b-0e60d4ee2ddf', 'sugestao', 'teste de sugestão ', 'teste de sugestao', 'resolvido', 'sua sugestão será encaminhada ao conselho da empresa.', false, 'ec14d799-942f-46a1-9d49-ae612d2054a4', 'a736b784-ede0-4239-832d-50518514f773', '2026-02-27 15:05:57.482046', '2026-02-27 15:08:09.242486');


--
-- TOC entry 4972 (class 0 OID 49417)
-- Dependencies: 225
-- Data for Name: respostas_questionario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('d4caaf1f-dbdf-4f01-8be4-534d61d8fb10', 'fdbd3a4b-9e7b-4fe0-94f7-9b44c4be8b76', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', 'bfd204e1-f133-44bf-8a02-f8713a5a2955', 'a3720be9-3b8a-4249-ab27-d81a18c6c7ef', NULL, NULL, '2026-02-26 14:24:48.347656');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('82559114-8ed6-4dc2-bf8d-c26386ed4b7e', 'fdbd3a4b-9e7b-4fe0-94f7-9b44c4be8b76', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', '0201c93a-aafd-4992-bcbc-ef78160c0f31', '4a22e471-83d0-4a61-87f8-84d96fda3e1a', NULL, NULL, '2026-02-26 14:24:48.41448');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('2e57e8c5-f5ef-4f34-bdbd-2e4a7f9a2a02', 'fdbd3a4b-9e7b-4fe0-94f7-9b44c4be8b76', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', '66a68830-db4c-450f-8100-4ad3201b3c38', '97522e88-b4e0-4afe-9f0e-ff48621a8bcc', NULL, NULL, '2026-02-26 14:24:48.428635');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('8fef1ce2-b881-4847-9e56-eff2fd24b310', '3d7cdead-5e03-4179-aa86-3903cc36de17', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', '2fdc64d2-6271-463f-b7c6-6abcdc49fda1', 'dd0b622b-39b5-4e26-9e3e-c5c10aac11d6', NULL, NULL, '2026-02-26 14:34:33.503683');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('e3b42095-9468-4909-a4b2-304a7f923997', '3d7cdead-5e03-4179-aa86-3903cc36de17', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', '489aad7a-a45a-4fbb-a469-6a735f5bfa2b', NULL, NULL, 2, '2026-02-26 14:34:33.557047');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('09006c14-11c7-4764-8960-a20c69617233', '3d7cdead-5e03-4179-aa86-3903cc36de17', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', 'dd2d5a21-4c10-4787-9f46-3e3e6c786f02', NULL, 'sim é muito bonita, essa cor', NULL, '2026-02-26 14:34:33.571403');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('a5bcf6b6-9dac-41b5-8efa-ad99aa22125b', '3d7cdead-5e03-4179-aa86-3903cc36de17', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', '2fdc64d2-6271-463f-b7c6-6abcdc49fda1', 'dd0b622b-39b5-4e26-9e3e-c5c10aac11d6', NULL, NULL, '2026-02-26 14:41:35.700212');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('4f2a4302-8642-436a-8f77-bbeea8c015a4', '3d7cdead-5e03-4179-aa86-3903cc36de17', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', '489aad7a-a45a-4fbb-a469-6a735f5bfa2b', NULL, NULL, 10, '2026-02-26 14:41:35.774151');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('e57c5002-5b91-4da9-baf4-d236dd8838a5', '3d7cdead-5e03-4179-aa86-3903cc36de17', '46e3150e-7fbd-4ff4-b083-f3cbb372ca32', 'dd2d5a21-4c10-4787-9f46-3e3e6c786f02', NULL, 'essa cor é muito bonita.', NULL, '2026-02-26 14:41:35.787168');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('2464f052-6a37-48f1-8d82-1597d53ad41f', '349c5235-08c5-4e13-a409-0da784a50d84', '1227e6f9-70eb-4119-8456-d89c58554683', '6d5969f1-a7ee-440f-bac7-3a814f7b59e3', 'f09f1c79-5472-49a4-b920-5b38c940bc44', NULL, NULL, '2026-02-26 15:19:28.109277');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('48ebf5ff-21ff-4437-a69f-47420a4551da', '349c5235-08c5-4e13-a409-0da784a50d84', '1227e6f9-70eb-4119-8456-d89c58554683', '292d1140-d09d-4a08-b976-740b5725ac33', NULL, NULL, 9, '2026-02-26 15:19:28.145606');
INSERT INTO public.respostas_questionario (id, questionario_id, usuario_id, questao_id, opcao_id, resposta_texto, resposta_valor, respondido_em) VALUES ('d4b4cd2d-90b7-4ab7-a47e-ad26eeecd4c6', '349c5235-08c5-4e13-a409-0da784a50d84', '1227e6f9-70eb-4119-8456-d89c58554683', '57a8c13c-66f2-4535-85a9-a557ea2ae381', NULL, 'sim', NULL, '2026-02-26 15:19:28.153677');


--
-- TOC entry 4973 (class 0 OID 49424)
-- Dependencies: 226
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios (id, nome, email, senha, cpf, telefone, cargo, tipo, ativo, empresa_id, departamento_id, criado_em, atualizado_em) VALUES ('6d36f380-6c35-48b3-a6bf-cc222d5a4eac', 'jose nagera', 'jhnagera80@gmail.com', '$2a$10$jZ/clIkBaGGafhomW9qp9uvhBB66rIsVprFWTVXX415pnEnGmiq7y', '6126581251', '6542+451', 'Analista', 'admin', true, '66cc78c5-a31c-4f8f-960f-02fb723967a5', '6d8e2b54-837e-4451-a9ae-62bfebcd4789', '2026-02-21 16:28:35.968046', '2026-02-21 16:28:35.968046');
INSERT INTO public.usuarios (id, nome, email, senha, cpf, telefone, cargo, tipo, ativo, empresa_id, departamento_id, criado_em, atualizado_em) VALUES ('fffc55bc-5946-404f-ae20-4dcae23c5be3', 'Administrador', 'admin@empresa.com', '$2a$10$cc5sBcf6abpJh2VT440P5eGi75HRJbhXDlCrflvI9OpiBku0IEuEq', NULL, NULL, NULL, 'super_admin', true, '66cc78c5-a31c-4f8f-960f-02fb723967a5', NULL, '2026-02-21 16:24:52.288342', '2026-02-21 16:24:52.288342');
INSERT INTO public.usuarios (id, nome, email, senha, cpf, telefone, cargo, tipo, ativo, empresa_id, departamento_id, criado_em, atualizado_em) VALUES ('152c52c6-c055-4379-97a8-4d802fe5b258', 't', 't', '$2a$10$UFV7tS85UTl3zeyElXkDeOs/NSBS756fmdonSxWiIUZOst0MFz236', NULL, NULL, NULL, 'colaborador', true, '66cc78c5-a31c-4f8f-960f-02fb723967a5', '705a69ec-8e63-4554-858f-81f8657d3be9', '2026-02-21 17:15:04.077161', '2026-02-21 17:15:04.077161');
INSERT INTO public.usuarios (id, nome, email, senha, cpf, telefone, cargo, tipo, ativo, empresa_id, departamento_id, criado_em, atualizado_em) VALUES ('1e2f1ab3-dde9-4ac7-b5ee-46e393a0c26b', 'Admin Locadora', 'locadora@gmail.com', '$2a$10$t1L2c1JUi/9bvVnL9dk4Fe0KgbHWe4CW3pSi7s3bcAkJ066cnVyQC', NULL, NULL, NULL, 'admin', true, 'a736b784-ede0-4239-832d-50518514f773', NULL, '2026-02-25 08:54:00.679574', '2026-02-25 08:54:00.679574');
INSERT INTO public.usuarios (id, nome, email, senha, cpf, telefone, cargo, tipo, ativo, empresa_id, departamento_id, criado_em, atualizado_em) VALUES ('46e3150e-7fbd-4ff4-b083-f3cbb372ca32', 'melissa', 'mel@gmail.com', '$2a$10$LDXED9KPDnjFc6w0ofsInO54O9SdgjXUSU3SFiU8V3T0Ix4DuURIq', NULL, NULL, 'Analista ', 'colaborador', true, 'a736b784-ede0-4239-832d-50518514f773', 'ec1771af-ca71-468a-86ed-c6de7a897c82', '2026-02-25 14:27:16.429886', '2026-02-25 14:27:16.429886');
INSERT INTO public.usuarios (id, nome, email, senha, cpf, telefone, cargo, tipo, ativo, empresa_id, departamento_id, criado_em, atualizado_em) VALUES ('39249326-9cf3-4ecc-94f8-02d077c95c58', 'rodrigo maia', 'maia@gmail.com', '$2a$10$zT4BPcfv/d9SsGxnlbEc5uvjHXTyrW8C5LqmErKviCPAf8.Top/xe', '2656482', '25658585', 'Rei', 'colaborador', true, 'a736b784-ede0-4239-832d-50518514f773', '833201b4-e064-4116-91d5-7351807423d1', '2026-02-26 15:02:49.065926', '2026-02-26 15:14:23.660107');
INSERT INTO public.usuarios (id, nome, email, senha, cpf, telefone, cargo, tipo, ativo, empresa_id, departamento_id, criado_em, atualizado_em) VALUES ('1227e6f9-70eb-4119-8456-d89c58554683', 'Rafael', 'rafael@gmail.com', '$2a$10$l.0ObayFJD5CYvg25rZSgOd3KusG/QKb4CnMIbrDJSx1lHbF42bpW', '251265+65', '+4121216468', 'Guarda', 'colaborador', true, 'a736b784-ede0-4239-832d-50518514f773', '833201b4-e064-4116-91d5-7351807423d1', '2026-02-26 13:47:05.097342', '2026-02-26 15:15:46.931966');
INSERT INTO public.usuarios (id, nome, email, senha, cpf, telefone, cargo, tipo, ativo, empresa_id, departamento_id, criado_em, atualizado_em) VALUES ('ec14d799-942f-46a1-9d49-ae612d2054a4', 'Carol', 'carol@gmail.com', '$2a$10$kPiUwVW2KfGPvGvauIClnumTVQW3OC1zSTVpnJ/9vwrsNHiUHGt0K', '+654+21+84', '4561684', 'professora', 'colaborador', true, 'a736b784-ede0-4239-832d-50518514f773', 'a08180b4-fa07-40a8-bd02-e75e0fe059c5', '2026-02-26 19:04:31.953162', '2026-02-26 19:04:31.953162');


--
-- TOC entry 4798 (class 2606 OID 49561)
-- Name: contracheques PK_1636dacdddba4bab299ad43b852; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracheques
    ADD CONSTRAINT "PK_1636dacdddba4bab299ad43b852" PRIMARY KEY (id);


--
-- TOC entry 4788 (class 2606 OID 49435)
-- Name: questoes PK_2f9d8a29333cf9246cec5f72abe; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questoes
    ADD CONSTRAINT "PK_2f9d8a29333cf9246cec5f72abe" PRIMARY KEY (id);


--
-- TOC entry 4776 (class 2606 OID 49437)
-- Name: denuncias PK_66f89a94d837d2ca501b8bd9456; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.denuncias
    ADD CONSTRAINT "PK_66f89a94d837d2ca501b8bd9456" PRIMARY KEY (id);


--
-- TOC entry 4772 (class 2606 OID 49439)
-- Name: arquivos PK_6c281400746e01a6bf85eacbf34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arquivos
    ADD CONSTRAINT "PK_6c281400746e01a6bf85eacbf34" PRIMARY KEY (id);


--
-- TOC entry 4778 (class 2606 OID 49441)
-- Name: departamentos PK_6d34dc0415358a018818c683c1e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT "PK_6d34dc0415358a018818c683c1e" PRIMARY KEY (id);


--
-- TOC entry 4784 (class 2606 OID 49443)
-- Name: opcoes_resposta PK_8d22c70483f3d1b4cd710239cb1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opcoes_resposta
    ADD CONSTRAINT "PK_8d22c70483f3d1b4cd710239cb1" PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 49445)
-- Name: questionarios PK_c2eaf6306fda8bc3e6b6b2288cd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionarios
    ADD CONSTRAINT "PK_c2eaf6306fda8bc3e6b6b2288cd" PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 49447)
-- Name: empresas PK_ce7b122b37c6499bfd6520873e1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT "PK_ce7b122b37c6499bfd6520873e1" PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 49449)
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- TOC entry 4790 (class 2606 OID 49451)
-- Name: reclamacoes PK_d93b01872a1d2f64c0d36706fe5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamacoes
    ADD CONSTRAINT "PK_d93b01872a1d2f64c0d36706fe5" PRIMARY KEY (id);


--
-- TOC entry 4774 (class 2606 OID 49453)
-- Name: avisos PK_f5879845d8caa44151fd8747e21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avisos
    ADD CONSTRAINT "PK_f5879845d8caa44151fd8747e21" PRIMARY KEY (id);


--
-- TOC entry 4792 (class 2606 OID 49455)
-- Name: respostas_questionario PK_fbac44e1eda545ffb5c8c961876; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respostas_questionario
    ADD CONSTRAINT "PK_fbac44e1eda545ffb5c8c961876" PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 49457)
-- Name: usuarios UQ_446adfc18b35418aac32ae0b7b5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE (email);


--
-- TOC entry 4782 (class 2606 OID 49459)
-- Name: empresas UQ_f5ed71aeb4ef47f95df5f8830b8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT "UQ_f5ed71aeb4ef47f95df5f8830b8" UNIQUE (cnpj);


--
-- TOC entry 4810 (class 2606 OID 49460)
-- Name: reclamacoes FK_13c77b1a53266997caf26733ac0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamacoes
    ADD CONSTRAINT "FK_13c77b1a53266997caf26733ac0" FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 4799 (class 2606 OID 49465)
-- Name: arquivos FK_1a9eb1932757d7f87063eeb06c2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arquivos
    ADD CONSTRAINT "FK_1a9eb1932757d7f87063eeb06c2" FOREIGN KEY (usuario_upload_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4806 (class 2606 OID 49470)
-- Name: questionarios FK_2e87f6f23cfc55968e3aafab5c3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionarios
    ADD CONSTRAINT "FK_2e87f6f23cfc55968e3aafab5c3" FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 4801 (class 2606 OID 49475)
-- Name: avisos FK_45cc74485fae5fa535122dbac24; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avisos
    ADD CONSTRAINT "FK_45cc74485fae5fa535122dbac24" FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 4812 (class 2606 OID 49480)
-- Name: respostas_questionario FK_5e0312b19efc3d37944064214de; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respostas_questionario
    ADD CONSTRAINT "FK_5e0312b19efc3d37944064214de" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4813 (class 2606 OID 49485)
-- Name: respostas_questionario FK_7d12aa3cf524c057071d6d85530; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respostas_questionario
    ADD CONSTRAINT "FK_7d12aa3cf524c057071d6d85530" FOREIGN KEY (questionario_id) REFERENCES public.questionarios(id);


--
-- TOC entry 4814 (class 2606 OID 49490)
-- Name: respostas_questionario FK_8d77e58657912a0764aedbea51d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respostas_questionario
    ADD CONSTRAINT "FK_8d77e58657912a0764aedbea51d" FOREIGN KEY (questao_id) REFERENCES public.questoes(id);


--
-- TOC entry 4818 (class 2606 OID 49562)
-- Name: contracheques FK_acba188f22d3618b6021306f7c9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracheques
    ADD CONSTRAINT "FK_acba188f22d3618b6021306f7c9" FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 4805 (class 2606 OID 49495)
-- Name: opcoes_resposta FK_af0ac87eea87f070c59637974c4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opcoes_resposta
    ADD CONSTRAINT "FK_af0ac87eea87f070c59637974c4" FOREIGN KEY (questao_id) REFERENCES public.questoes(id) ON DELETE CASCADE;


--
-- TOC entry 4809 (class 2606 OID 49500)
-- Name: questoes FK_afffe33b90be78d44dfec1f7365; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questoes
    ADD CONSTRAINT "FK_afffe33b90be78d44dfec1f7365" FOREIGN KEY (questionario_id) REFERENCES public.questionarios(id) ON DELETE CASCADE;


--
-- TOC entry 4804 (class 2606 OID 49505)
-- Name: departamentos FK_b66dbedc1b7354ea37e3931551f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT "FK_b66dbedc1b7354ea37e3931551f" FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 4811 (class 2606 OID 49510)
-- Name: reclamacoes FK_b9e4fef7e5c9f637b1e537af98c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamacoes
    ADD CONSTRAINT "FK_b9e4fef7e5c9f637b1e537af98c" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4819 (class 2606 OID 49567)
-- Name: contracheques FK_ba27d75f195cb995189e8558594; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracheques
    ADD CONSTRAINT "FK_ba27d75f195cb995189e8558594" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4802 (class 2606 OID 49515)
-- Name: denuncias FK_be131808a09097a0a3897946c89; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.denuncias
    ADD CONSTRAINT "FK_be131808a09097a0a3897946c89" FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 4816 (class 2606 OID 49520)
-- Name: usuarios FK_be2e056fe966e6c0cd5347c4efc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "FK_be2e056fe966e6c0cd5347c4efc" FOREIGN KEY (departamento_id) REFERENCES public.departamentos(id);


--
-- TOC entry 4807 (class 2606 OID 49525)
-- Name: questionarios FK_cd584c9ce71b66774e54b1aa638; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionarios
    ADD CONSTRAINT "FK_cd584c9ce71b66774e54b1aa638" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4815 (class 2606 OID 49530)
-- Name: respostas_questionario FK_d56638e543720afde84b065ece1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respostas_questionario
    ADD CONSTRAINT "FK_d56638e543720afde84b065ece1" FOREIGN KEY (opcao_id) REFERENCES public.opcoes_resposta(id);


--
-- TOC entry 4803 (class 2606 OID 49535)
-- Name: denuncias FK_d637ef9380327ef446ab81c3c31; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.denuncias
    ADD CONSTRAINT "FK_d637ef9380327ef446ab81c3c31" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4808 (class 2606 OID 49540)
-- Name: questionarios FK_f28d1bd9038b97b99cdef04e06c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionarios
    ADD CONSTRAINT "FK_f28d1bd9038b97b99cdef04e06c" FOREIGN KEY (departamento_id) REFERENCES public.departamentos(id);


--
-- TOC entry 4817 (class 2606 OID 49545)
-- Name: usuarios FK_f7a79f991bd7319aef158bfbd38; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "FK_f7a79f991bd7319aef158bfbd38" FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 4800 (class 2606 OID 49550)
-- Name: arquivos FK_fd834bb71daab3396cc10e4e86a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arquivos
    ADD CONSTRAINT "FK_fd834bb71daab3396cc10e4e86a" FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


-- Completed on 2026-03-08 19:00:55

--
-- PostgreSQL database dump complete
--

