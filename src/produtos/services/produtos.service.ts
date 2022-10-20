import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, ILike, DeleteResult, ReturningStatementNotSupportedError } from "typeorm"
import { Produto } from "../entities/produtos.entity"

@Injectable()
export class ProdutosService {
    constructor(@InjectRepository(Produto)
    private produtosRepository: Repository<Produto>){}
    
    //metodo para achar todos
 async findAll(): Promise<Produto[]>{
    return await this.produtosRepository.find()
 }
 //achar pelo id
 async findById(id: number): Promise<Produto>{
    let produtos = await this.produtosRepository.findOne({
        where: {
            id
        }
    });
if (!produtos){
    throw new  HttpException('produto cujo id foi referido não existe', HttpStatus.NOT_FOUND);
}
return produtos;
}

//metodo de achar pelo nome
async findByName(nome: string): Promise<Produto[]>{
    return await this.produtosRepository.find({
        where: {
            nome: ILike(`${nome}$`)
        }
    })
}
//metodo de criar dados no banco de dados
async create(produtos: Produto): Promise<Produto>{
   return await this.produtosRepository.save(produtos);
}
//metodo de atualizar dados no banco de dados pelo is
async update(produtos: Produto): Promise<Produto>{
    let buscarProdutos: Produto = await this.findById(produtos.id)
    if (buscarProdutos || produtos.id) {
        throw new HttpException('id referente ao produto não existe', HttpStatus.NOT_FOUND);} 
        return this.produtosRepository.save(produtos);
}
//metodo de deletar
async delete(id: number): Promise<DeleteResult>{
    let buscarProdutos: Produto = await this.findById(id)
    if (buscarProdutos) {
 throw new HttpException('ID referente ao produto não existe', HttpStatus.NOT_FOUND);
    }
    return await this.produtosRepository.delete(id);
}
       

 

}