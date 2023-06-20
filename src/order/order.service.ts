import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrdersDocument } from 'src/order/schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private ordersModel: Model<OrdersDocument>
  ) {}
  async createorder(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersModel.create(createOrderDto);
  }

  async findallorder() {
    return this.ordersModel.find().lean();
  }

  async findoerderbyid(id: string) {    
    return this.ordersModel.findOne({_id: id}).lean();
  }

  async findoerderbyid1(id: string) { 
    return this.ordersModel.find({_id: id}).sort({price:'desc',amount:1,id:1}).lean();
  }
  
  async findreportoerder() {    
    return this.ordersModel.aggregate(
      [
        {
          $unwind: "$books"
        },
        {
          $group: {
            _id: {
              bookname: "$books.bookname"
            },
            "sumAmout": {
              $sum: "$books.amout"
            },
            "sumPrice": {
              $sum: "$books.booktotal"
            }
          }
        },
        {
          "$group": {
            "_id": 0,
            "data": {
              $addToSet: {
                "bookname": "$_id.bookname",
                "sumAmout": "$sumAmout",
                "sumPrice": "$sumPrice"
              }
            },
          },
        },
        {
          $unwind: "$data",
        },
        {
          $sort: ({
            'data.sumAmout': -1  ,'data.sumPrice': -1  /* , 'adddate': 1 */})
        },
/*         {
          $sort: {
            'data.sumAmout': 1 , 
          },
        },  */
      ]
    );
  }
/// 
/* async findreportoerdergroup() {    
  //return this.ordersModel.find().sort({booktype:1,price:1,amount:1}).lean();
  return this.ordersModel.aggregate(
    [
      {
        $unwind: "$books"
      },
      {
        $group: {
          _id: {
            bookname: "$books.booktype"
          },
          
          "sumPrice": {
            $sum: "$books.booktotal"
          }
          ,"sumAmout": {
            $sum: "$books.amout"  
          }
         
        }
      },
      {
        "$group": { 
          "_id": 0,
          "data": {
            $addToSet: {
              "bookname": "$_id.bookname",
              "sumPrice": "$sumPrice",
              "sumAmout": "$sumAmout"
            }
          },
        },
      },
      {
        $unwind: "$data",
      },
      {
        $sort: ({
          'sumAmout': 1 , 'adddate': 1})
      },
    ]
  );
} */

async findreportorderlast(customername:string) {  
  return this.ordersModel.findOne({ customername :customername
  })
  .sort({createdAt:'desc'})
  .lean();
} 

  async removeorder(id: string) {
    return this.ordersModel.remove({_id: new Types.ObjectId(id)});
  }
}
