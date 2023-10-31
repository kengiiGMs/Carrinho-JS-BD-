create database carrinho;
use carrinho;
drop database carrinho;

create table usuario(
idUsuario int auto_increment,
nomeUsuario varchar(40) not null,
emailUsuario varchar(90) not null,
senhaUsuario varchar(40) not null,
primary key (idUsuario)
);

insert into usuario (nomeUsuario, emailUsuario, senhaUsuario) values
('Gustavo','gustavo@gmail.com','1234'),
('Douglas','douglas@gmail.com','1234'),
('Luana','luana@gmail.com','1234');

create table manga(
idManga int auto_increment,
nomeManga varchar(40) not null,
valorManga decimal(5,2) not null,
descricaoManga varchar(240) null,
quantidadeMangaEstoque int(4) not null,
primary key (idManga)
);

insert into manga (nomeManga,valorManga,descricaoManga,quantidadeMangaEstoque) values
('One Piece Vol. 23',34.9,'A princesa Vivi e o Bando do Chapéu de Palha descobrem a localização da bomba, mas o tempo está acabando! O duelo entre Luffy e Crocodile será definido!',200),
('Kimetsu no Yaiba Vol. 3', 34.9, 'Tanjirou e Nezuko cruzam caminho com onis que manipulam armas misteriosas e são subordinados diretos de Kibutsuji. Mesmo a ajuda de Tamayo e Yushirou pode não ser o bastante para enfrentá-los!! Será que eles conseguirão pistas para chegar ao seu arqui-inimigo Kibutsuji?!',100),
('Jujutsu Kaisen Vol. 0', 36.9, 'O estudante colegial Yuuta Okkotsu deseja ser executado porque sofre com as ações de Rika Orimoto, espírito rancoroso que o possuiu. Enquanto isso, Satoru Gojou, professor que ensina a exorcizar ´maldições´, transfere Yuuta para a Escola Técnica Superior de Jujutsu de Tokyo. Tem início a pré-sequência da série Jujutsu Kaisen!', 100);

create table carrinho(
idCarrinho int not null auto_increment,
idManga int not null,
idUsuario int not null,
quantidadeCarrinho int not null,
primary key (idCarrinho),
foreign key(idManga) references manga(idManga),
foreign key (idUsuario) references usuario(idUsuario)
);

create table pedido(
idPedido int not null auto_increment,
idUsuario int not null,
dataPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP null,
primary key(idPedido),
foreign key (idUsuario) references usuario(idUsuario)
);

create table itensPedido(
 idItemPedido int not null auto_increment,
 idPedido int not null,
 idManga int not null,
 quantidade int not null,
 primary key (idItemPedido),
 foreign key (idPedido) references pedido(idPedido),
 foreign key (idManga) references manga(idManga)
);
