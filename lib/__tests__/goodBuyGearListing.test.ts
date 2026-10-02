import { describe, expect, it } from 'vitest';
import { goodBuyGearListingSummary as summarize, goodBuyGearProductEndpoint as endpoint } from '@/lib/catalog/goodBuyGearListing';

describe('exact GoodBuy Gear listing lookup', () => {
  it('unwraps the saved destination without following unrelated hosts or search sessions', () => {
    const destination='https://goodbuygear.com/products/desert-lark-linen-sling?_pos=2&_sid=25ac132e5&_ss=r';
    expect(endpoint(`https://goodbuygear.pxf.io/c/6560395/3220593/40600?u=${encodeURIComponent(destination)}`)).toBe('https://goodbuygear.com/products/desert-lark-linen-sling.js');
    for (const url of ['https://goodbuygear.com.evil.test/products/x','http://goodbuygear.com/products/x','https://user:pass@goodbuygear.com/products/x','https://goodbuygear.com/search?q=x','https://goodbuygear.pxf.io/c/x?u=https://localhost/private']) expect(endpoint(url)).toBeNull();
  });
  it('uses the lowest available variant price, cents conversion and actual condition', () => {
    expect(summarize({available:true,tags:['Condition_Barely Used'],variants:[{available:false,price:100},{available:true,price:23999},{available:true,price:25000}]})).toEqual({price:239.99,condition:'Barely Used'});
  });
  it('omits prices when sold out, invalid, or missing; never invents an open-box condition', () => {
    for (const data of [null,{}, {available:false,tags:['Condition_Open Box'],variants:[{available:true,price:10000}]}]) expect(summarize(data)).toEqual({price:null,condition:'GoodBuy Gear'});
    expect(summarize({available:true,variants:[{available:true,price:-1},{available:true,price:'100'}]})).toEqual({price:null,condition:'GoodBuy Gear'});
  });
});
