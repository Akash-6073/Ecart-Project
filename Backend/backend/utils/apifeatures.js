class ApiFeatures{
    // here this.query is product.find()
    constructor(query,queryStr){ 
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
                name:{
                    // this are mongodb operators
                    $regex:this.queryStr.keyword,
                    $options:"i" // this means case insensitive (capital and small all are same)
                }
        }
        :
        {};
        this.query = this.query.find({...keyword});  // this is a spread operator it will pass all pairs and values
        return this;
    }
    filter(){
        const queryCopy = {...this.queryStr}

        // Removing some fields for category

        const removefields = ["keyword","page","limit"];
        removefields.forEach((key)=> delete queryCopy[key]);// this will remove that selected fields

        // Filter for price and rating


        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);  
        // so this will replace has gt = $gt  , gte= $gte ...
        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(queryCopy)
        return this;

    }
    pagination(resultPerPage){
        let currentPage = Number(this.queryStr.page) || 1;
         
        let skip = resultPerPage * (currentPage-1)

        this.query  = this.query.limit(resultPerPage).skip(skip); // this will skip the 1st n products and start showing the next
        return this;
    }

   
}

module.exports = ApiFeatures;