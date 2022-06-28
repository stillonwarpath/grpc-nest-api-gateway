import { Body, Controller, Get, Inject, OnModuleInit, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ProductServiceClient, PRODUCT_SERVICE_NAME, CreateProductRequest, CreateProductResponse, FindOneResponse } from './product.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';

@Controller('product')
export class ProductController implements OnModuleInit {

    private svc: ProductServiceClient;

    @Inject(PRODUCT_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit() : void {
        this.svc = this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
    }

    @Post()
    @UseGuards(AuthGuard)
    private async createProduct(@Body() body: CreateProductRequest) : Promise<Observable<CreateProductResponse>> {
        return this.svc.createProduct(body);
    }

    @Get()
    @UseGuards(AuthGuard)
    private async findOne(@Param('id', ParseIntPipe) id: number): Promise<Observable<FindOneResponse>> {
        return this.svc.findOne({ id });
    }

}
