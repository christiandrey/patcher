import manager from '../manager';

describe('manager', () => {
  test('should merge correctly with one level objects', () => {
    const to = {
      a: 1,
      b: 2,
    };

    const from = {
      a: 3,
    };

    const expectedResult = {
      a: 3,
      b: 2,
    };

    const actualResult = manager.merge(to, from);

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test('should merge correctly with multi level objects', () => {
    const to = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
      },
    } as any;

    const expectedResult = {
      a: 1,
      b: 2,
      c: {
        a: 2,
      },
    };

    const actualResult = manager.merge(to, {c: {a: 2}});

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test('should merge multiple correctly with multi level objects', () => {
    const to = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
      },
    } as any;

    const expectedResult = {
      a: 1,
      b: {
        a: 1,
      },
      c: {
        a: 2,
      },
    };

    const actualResult = manager.merge(to, {
      b: {a: 1},
      c: {a: 2},
    });

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test('should merge correctly with deep multi level objects', () => {
    const to = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
        c: {
          a: 1,
          b: 2,
        },
      },
    } as any;

    const from = {
      c: {
        a: 1,
        b: {
          a: 1,
          b: 2,
        },
      },
    };

    const expectedResult = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: {
          a: 1,
          b: 2,
        },
        c: {
          a: 1,
          b: 2,
        },
      },
    };

    const actualResult = manager.merge(to, from);

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test('should patch correctly with one level objects', () => {
    const to = {
      a: 1,
      b: 2,
    };

    const from = {
      a: 3,
    };

    const expectedResult = {
      a: 3,
      b: 2,
    };

    const actualResult = manager.patch(to, from);

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test('should patch correctly with multi level objects', () => {
    const to = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
      },
    } as any;

    const expectedResult = {
      a: 1,
      b: 2,
      c: {
        a: 2,
        b: 2,
      },
    };

    const actualResult = manager.patch(to, {c: {a: 2}});

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test('should patch multiple correctly with multi level objects without enforced new type', () => {
    const to = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
      },
    } as any;

    const expectedResult = {
      a: 1,
      b: 2,
      c: {
        a: 2,
        b: 2,
      },
    };

    const actualResult = manager.patch(
      to,
      {
        b: {a: 1},
        c: {a: 2},
      },
      false,
    );

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test('should patch multiple correctly with multi level objects with enforced new type', () => {
    const to = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
      },
    } as any;

    const expectedResult = {
      a: 1,
      b: {
        a: 1,
      },
      c: {
        a: 2,
        b: 2,
      },
    };

    const actualResult = manager.patch(
      to,
      {
        b: {a: 1},
        c: {a: 2},
      },
      true,
    );

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test('should patch correctly with deep multi level objects', () => {
    const to = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
        c: {
          a: 1,
          b: 2,
        },
      },
    } as any;

    const from = {
      c: {
        a: 2,
        b: {
          b: 3,
        },
        c: {
          a: 2,
        },
      },
    };

    const expectedResult = {
      a: 1,
      b: 2,
      c: {
        a: 2,
        b: {
          b: 3,
        },
        c: {
          a: 2,
          b: 2,
        },
      },
    };

    const actualResult = manager.patch(to, from, true);

    expect(actualResult).toStrictEqual(expectedResult);
  });
});
