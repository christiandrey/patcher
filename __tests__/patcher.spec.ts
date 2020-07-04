import patcher from '../index';

describe('patcher', () => {
  test('should patch correctly with one level objects', () => {
    const target = {
      a: 1,
      b: 2,
    };

    const expectedResult = {
      a: 3,
      b: 2,
    };

    const actualResult = patcher.patch(target, {a: {$: 3}});

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should patch correctly with root objects', () => {
    const target = {
      a: 1,
      b: 2,
    };

    const expectedResult = {
      a: 3,
      b: 2,
    };

    const actualResult = patcher.patch(target, {$: {a: 3}});

    expect(actualResult).toMatchObject(expectedResult);
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

    const actualResult = patcher.patch(to, {c: {a: {$: 2}}});

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should patch correctly with deep multi level objects', () => {
    const to = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: {
          b: 2,
        },
        c: {
          a: 1,
          b: 2,
        },
      },
    } as any;

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

    const actualResult = patcher.patch(to, {
      c: {
        a: {$: 2},
        b: {
          b: {$: 3},
        },
        c: {
          a: {$: 2},
        },
      },
    });

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should patch objects containing arrays', () => {
    const to = {
      a: 1,
      b: [1, 2],
    };

    const expectedResult = {
      a: 2,
      b: [1, 2, 3],
    };

    const actualResult = patcher.patch(to, {
      a: {$: 2},
      b: {$: [3]},
    });

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should patch objects containing arrays with position set to start', () => {
    const to = {
      a: 1,
      b: [1, 2],
    };

    const expectedResult = {
      a: 2,
      b: [3, 1, 2],
    };

    const actualResult = patcher.patch(
      to,
      {
        a: {$: 2},
        b: {$: [3]},
      },
      {arrayPosition: 'start'},
    );

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should patch objects containing arrays without distinct option', () => {
    const to = {
      a: 1,
      b: [1, 2],
    };

    const expectedResult = {
      a: 2,
      b: [1, 2, 1, 3],
    };

    const actualResult = patcher.patch(to, {
      a: {$: 2},
      b: {$: [1, 3]},
    });

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should patch objects containing arrays with distinct option', () => {
    const to = {
      a: 1,
      b: [1, 2],
    };

    const expectedResult = {
      a: 2,
      b: [1, 2, 3],
    };

    const actualResult = patcher.patch(
      to,
      {
        a: {$: 2},
        b: {$: [1, 3]},
      },
      {arrayDistinct: true},
    );

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should set correctly with root level objects', () => {
    const target = {
      a: 1,
      b: 2,
    };

    const expectedResult = {
      a: 3,
    };

    const actualResult = patcher.set(target, {$: {a: 3}});

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should set correctly with one level objects', () => {
    const target = {
      a: 1,
      b: 2,
    };

    const expectedResult = {
      a: 3,
      b: 2,
    };

    const actualResult = patcher.set(target, {a: {$: 3}});

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should set correctly with multi level objects', () => {
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

    const actualResult = patcher.set(to, {c: {$: {a: 2, b: 2}}});

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should set objects containing arrays', () => {
    const to = {
      a: 1,
      b: [1, 2],
    };

    const expectedResult = {
      a: 2,
      b: [1, 2, 3],
    };

    const actualResult = patcher.set(to, {
      a: {$: 2},
      b: {$: [1, 2, 3]},
    });

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should remove correctly with root level objects', () => {
    const target = {
      a: 1,
      b: 2,
    };

    const expectedResult = {
      a: 1,
    };

    const actualResult = patcher.unset(target, {$: ['b']});

    expect(actualResult).toMatchObject(expectedResult);
  });

  test('should remove correctly with multi level objects', () => {
    const target = {
      a: 1,
      b: {
        a: 2,
        b: 3,
      },
    };

    const expectedResult = {
      a: 1,
      b: {
        a: 2,
      },
    };

    const actualResult = patcher.unset(target, {b: {$: ['b']}});

    expect(actualResult).toMatchObject(expectedResult);
  });
});
