import { expect } from 'chai'

import { hasVariables } from '../../src/utils/has-variables'

describe('hasVariables', function () {

  describe('텍스트에 내부 변수표현이 있는 지를 결정', function() {

    it('텍스트 내에 내부속성변수표현이 있는 경우를 체크한다.', function () {

      expect(hasVariables("ABC #{abc} DEF")).to.equal(true);
      expect(hasVariables("ABC #{abc DEF")).to.equal(false);
      expect(hasVariables("#{x} abc DEF")).to.equal(true);
      expect(hasVariables("ABCD#{x}DEF")).to.equal(true);
      expect(hasVariables("ABCD DEF")).to.equal(false);
    });

    it('텍스트 내에 변수표현이 있는 경우를 체크한다.', function () {

      expect(hasVariables("ABC ${abc} DEF")).to.equal(true);
      expect(hasVariables("ABC ${abc:1234567890} DEF")).to.equal(true);
      expect(hasVariables("ABC ${abc DEF")).to.equal(false);
      expect(hasVariables("${x} abc DEF")).to.equal(true);
      expect(hasVariables("ABCD${x}DEF")).to.equal(true);
      expect(hasVariables("ABCD DEF")).to.equal(false);
    });

  });
});
