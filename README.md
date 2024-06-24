# Auto-shop-server

## For start

> .env

```
DATABASE_URL="your url"
SECRET_KEY="some secret key"
```

> npm

```
npm install
npm start
```

## API

# Authorization

> SingIn

```
[POST]
/auth/login
{
"email": "some_email@mail.ru",
"password": "some_password"
}
```

> Registration

```
[POST]
/auth/registration
{
"name": "some_name",
"email": "some_email@mail.ru",
"password": "some_password",
"phone": "some_phone"
}
```

# Cars

> Add new car

```
['ADMIN', 'USER']
[POST]
/car
{
"name": "some_name",
"price": some_price,
"year": some_year,
?"description": "some_descr",
"type": some_type, > SPORT, LUX, TUNED, ORIGINAL
"status": some_status > SOLD, EXPOSED, PROCESSED (Only EXPOSED for USER)
"file": IMG_FILE.jpg
}
```

> Change status for car by ID

```
['ADMIN']
[PUT]
/car/:id?status=NEW_STATUS
```

> Get all cars

```
['ADMIN']
[GET]
/car?type=TYPE&status=STATUS&order=ORDER > order: desc or acs
```

> Get car by ID

```
['ADMIN']
[GET]
/car/:id
```

> Get only exposed cars

```
[GET]
/exp-car?type=TYPE&order=ORDER > order: desc or acs
```

> Get exposed car by ID

```
[GET]
/exp-car/:id
```

> Remove car by ID

```
['ADMIN']
[DELETE]
/car/:id
```

# Orders

> Add new order

```
['ADMIN', 'USER']
[POST]
/order
{
"carId": CAR_ID,
"userId": USER_ID,
"type": some_type     // BUYING, SELLING
}                    // default status - PROCESSED
```

> Change status for order by ID

```
['ADMIN']
[PUT]
/order/:id?status=NEW_STATUS
```

> Get all orders

```
['ADMIN']
[GET]
/order?type=TYPE&status=STATUS // types: BUYING, SELLING; status: PROCESSED, CANCELED, COMPLETED
```

> Get order by ID

```
['ADMIN']
[GET]
/order/:id
```

> Remove order by ID

```
['ADMIN']
[DELETE]
/order/:id
```
