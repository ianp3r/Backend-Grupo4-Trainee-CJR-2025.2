export type ProdutoDto = {
  id?: number;
  lojaId: number;
  categoriaId?: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  createdAt?: Date;
  updatedAt?: Date;
};
