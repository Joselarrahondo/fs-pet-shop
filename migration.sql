DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
    id SERIAL,
    age INTEGER,
    name text,
    kind text
);

INSERT INTO pets (age, name, kind) VALUES(5, 'Buttons', 'snakes');
INSERT INTO pets (age, kind, name) VALUES (7, 'rainbow', 'fido');
INSERT INTO pets (age, kind, name) VALUES (5,'snake', 'Buttons');
INSERT INTO pets (age, kind, name) VALUES (3, 'parakeet', 'Cornflake');
INSERT INTO pets (age, kind, name) VALUES (1, 'capybara', 'marco');