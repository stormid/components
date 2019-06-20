import Measure from '../../../src';

window.addEventListener('DOMContentLoaded', () => {
    window.__Measure__ = Measure.init( 'UA-141774857-1');    
    // __Measure__.event({ category: 'Test category', action: 'Test action', label: 'Test label', value: 666 })
    __Measure__.ecommerce.impression([
        {
            name: 'Impression list 1',
            items: [
                {
                    id: '1324',
                    name: 'Product 1',
                    category: 'Category 1',
                    price: '19.95',
                    brand: 'Google',
                    variant: 'Black',
                    position: '1'//1-200
                },            
                {
                    id: '5678',
                    name: 'Product 3',
                    category: 'Category 1',
                    price: '29.95',
                    brand: 'Apple',
                    variant: 'Black',
                    position: '2'
                },            
                {
                    id: '9101',
                    name: 'Product 5',
                    category: 'Category 1',
                    price: '9.95',
                    brand: 'Microsoft',
                    variant: 'Black',
                    position: '3'
                }
            ]
        },
        {
            name: 'Impression list 2',
            items: [
                {
                    id: '1123',
                    name: 'Product 2',
                    category: 'Category 1',
                    price: '5.95',
                    brand: 'Amazon',
                    variant: 'Black',
                    position: '4'//1-200
                }
            ]
        }
    ]);
});

/*

{ 
    action: 'Impression',
    data: [ //'impressions'
        {
            id,
            name,
            category,
            price
        }
    ]
}
--
{ 
    action: 'Click',
    data: [ //'products'
        {
            id,
            name,
            category,
            price
        }
    ]
}
--
{ 
    action: 'Detail',
    data: [ //'products'
        {
            id,
            name,
            category,
            price
        }
    ]
}


    */
/*
&il1nm=Search%20Results                  // Impression list 1. Required.
&il1pi1id=P12345                         // Product Impression 1 ID. Either ID or name must be set.
&il1pi1nm=Android%20Warhol%20T-Shirt     // Product Impression 1 name. Either ID or name must be set.
&il1pi1ca=Apparel%2FT-Shirts             // Product Impression 1 category.
&il1pi1br=Google                         // Product Impression 1 brand.
&il1pi1va=Black                          // Product Impression 1 variant.
&il1pi1ps=1                              // Product Impression 1 position.
&il1pi1cd1=Member                        // Custom dimension.

&il2nm=Recommended%20Products            // Impression list 2.
&il2pi1nm=Yellow%20T-Shirt               // Product Impression 1 name.
&il2pi2nm=Red%20T-Shirt                  // Product Impression 2 name.
*/