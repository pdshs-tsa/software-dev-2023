const create_maze = (height, length) => {

    //helper vars
    const h = height - 1;
    const l = length - 1;
    const sh = h - 2;
    const sl = l - 2;
    let curx = 0;
    let cury = 0;
    //creating array
    var cells = []
    for (let i = 0; i < height; i++) {
        const row = [];
        for (let i2 = 0; i2 < length; i2++) {
            row.push({filled: false});
        }
        cells.push(row);
    }
    //filling outside
    for (let i = 0; i < 4; i++) {
        if (i % 2 === 0) {
            let x = Math.floor(i * 0.5 * h);
            for (let i = Math.floor(-1 * (x / h) + 1); i < length - Math.floor(x / h); i++) {
                cells[x][i] = {filled: true};
            }
        } else {
            let x = Math.floor((i - 1) * 0.5 * l);
            for (let i = Math.floor(x / l); i < height - Math.floor(-1 * (x / l) + 1); i++) {
                cells[i][x] = {filled: true};
            }
        }
    }

    //creating the meta array
    let meta = [];
    for (let i = 0; i < height - 2; i++) {
        const row = [];
        for (let i2 = 0; i2 < length - 2; i2++) {
            row.push(-1);
        }
        meta.push(row);
    }
    //prefilling grid (weighted, but doesn't guarrentee a good or even possible maze)
    let end = false
    //here I removed 0 since it is technically never invalid, but it kinda stops all progression
    const all_types = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    //types that allow path to continue (weights)
    let prefered_types = [3, 5, 6, 7, 9, 10, 11, 12, 13, 14];
    let cur_type;
    while (!end) {
        if (meta[cury][curx] !== -2) {
            //removing invalid cells
            let invalid_types = [];

            //left invalids
            if (curx === 0) {
                invalid_types = invalid_types.concat([8, 9, 10, 11, 12, 13, 14, 15]);
            } else if (meta[cury][curx - 1] === -2) {
                invalid_types = invalid_types.concat([8, 9, 10, 11, 12, 13, 14, 15]);
            } else if (meta[cury][curx - 1] > 0) {
                invalid_types = invalid_types.concat([1, 2, 3, 4, 5, 6, 7]);
            }
            //right invalids
            if (curx === sl) {
                invalid_types = invalid_types.concat([2, 3, 6, 7, 10, 11, 14, 15]);
            } else if (meta[cury][curx + 1] === -2) {
                invalid_types = invalid_types.concat([2, 3, 6, 7, 10, 11, 14, 15]);
            } else if (meta[cury][curx + 1] > 0) {
                invalid_types = invalid_types.concat([1, 4, 5, 8, 9, 12, 13]);
            }
            //up invalids
            if (cury === 0) {
                invalid_types = invalid_types.concat([1, 3, 5, 7, 9, 11, 13, 15]);
            } else if (meta[cury - 1][curx] === -2) {
                invalid_types = invalid_types.concat([1, 3, 5, 7, 9, 11, 13, 15]);
            } else if (meta[cury - 1][curx] > 0) {
                invalid_types = invalid_types.concat([2, 4, 6, 8, 10, 12, 14]);
            }
            //down invalids
            if (cury === sh) {
                invalid_types = invalid_types.concat([4, 5, 6, 7, 12, 13, 14, 15]);
            } else if (meta[cury + 1][curx] === -2) {
                invalid_types = invalid_types.concat([4, 5, 6, 7, 12, 13, 14, 15]);
            } else if (meta[cury + 1][curx] > 0) {
                invalid_types = invalid_types.concat([1, 2, 3, 8, 9, 10, 11]);
            }

            //creating the wanted and valid lists
            const valid_types = all_types.filter(x => !invalid_types.includes(x));
            const wanted_types = prefered_types.filter(x => !invalid_types.includes(x));
            //assigning cell type
            if (valid_types.length === 0) {
                cur_type = -2;
                meta[cury][curx] = cur_type;
            } else if (wanted_types.length > 0) {
                cur_type = wanted_types[Math.floor(Math.random() * wanted_types.length)];
                meta[cury][curx] = cur_type;
            } else {
                cur_type = valid_types[Math.floor(Math.random() * valid_types.length)];
                meta[cury][curx] = cur_type;
            }

            //changing required walls to confirmed walls

            //left walls
            if ([0, 1, 2, 3, 4, 5, 6, 7].includes(cur_type)) {
                if (curx !== 0) {
                    meta[cury][curx - 1] = -2;
                }
            }
            // right walls
            if ([0, 1, 4, 5, 8, 9, 12, 13].includes(cur_type)) {
                if (curx !== sl) {
                    meta[cury][curx + 1] = -2;
                }
            }
            // up walls
            if ([0, 2, 4, 6, 8, 10, 12, 14].includes(cur_type)) {
                if (cury !== 0) {
                    meta[cury - 1][curx] = -2;
                }
            }
            // down walls
            if ([0, 1, 2, 3, 8, 9, 10, 11].includes(cur_type)) {
                if (cury !== sh) {
                    meta[cury + 1][curx] = -2;
                }
            }
        }
        if (curx !== sl) {
            curx++;
        } else if (cury !== sh) {
            curx = 0;
            cury++;
        } else {
            end = true;
        }
    }

    //fixing end
    meta[sh][sl] = 0;
    //interpreting
    for (let i = 0; i < height - 2; i++) {
        for (let i2 = 0; i2 < length - 2; i2++) {
            if (meta[i][i2] < 0) {
                cells[i + 1][i2 + 1] = {filled: true};
            }
        }
    }

    //check + remove loop
    end = false;
    while(!end){
        //finding all cells connecting to start
        var adjacents = [[1, 1]];
        var founds = [];
        var walls = [];

        for (let i = 0; i < cells.length; i++) {
            for (let i2 = 0; i2 < cells[i].length; i2++) {
                if (cells[i][i2]) {
                    walls.push([i2, i]);
                }
            }
        }
        var new_adjacents = [];
        while (adjacents.length > 0) {
            new_adjacents = [];
            for (let i = 0; i < adjacents.length; i++) {
                if(!walls.some((wall) => wall[0] === adjacents[i][0] && wall[1] === adjacents[i][1])) {
                    founds.push(adjacents[i]);
                    const invalids = founds.concat(new_adjacents, adjacents);
                    if (!invalids.some((invalid) => invalid[0] === adjacents[i][0] - 1 && invalid[1] === adjacents[i][1])) {
                        new_adjacents.push([adjacents[i][0] - 1, adjacents[i][1]]);
                    }
                    if (!invalids.some((invalid) => invalid[0] === adjacents[i][0] + 1 && invalid[1] === adjacents[i][1])) {
                        new_adjacents.push([adjacents[i][0] + 1, adjacents[i][1]]);
                    }
                    if (!invalids.some((invalid) => invalid[0] === adjacents[i][0] && invalid[1] === adjacents[i][1] - 1)) {
                        new_adjacents.push([adjacents[i][0], adjacents[i][1] - 1]);
                    }
                    if (!invalids.some((invalid) => invalid[0] === adjacents[i][0] && invalid[1] === adjacents[i][1] + 1)) {
                        new_adjacents.push([adjacents[i][0], adjacents[i][1] + 1]);
                    }
                }
            }
            adjacents = new_adjacents;
        }

        //finding + counting all open cells
        const opens = [];
        for (let i = 0; i < cells.length; i++) {
            for (let i2 = 0; i2 < cells[i].length; i2++) {
                if (!cells[i][i2]) {
                    opens.push([i2, i]);
                }
            }
        }

        let open_count = 0;
        for (let i = 0; i < opens.length; i++) {
            if (!founds.some((found) => found[0] === opens[i][0] && found[1] === opens[i][1])) {
                open_count++;
            }
        }

        //find if over 5/6 of the maze is assecible and the end is assecible, then end the process
        //otherwise, remove a wall and continue
        if (open_count < ((h - 1) * (l - 1)) / 6 && founds.some((found) => found[0] === l-1 && found[1] === h-1)) {
            end = true;
        } else {
            const filtered_walls = walls.filter((x) => x[0] !== 0 && x[1] !== 0 && x[0] !== l && x[1] !== h);
            const KO = filtered_walls[Math.floor(Math.random() * filtered_walls.length)];
            cells[KO[1]][KO[0]] = {filled: false};
        }
    }

    return cells;
};

export {create_maze};