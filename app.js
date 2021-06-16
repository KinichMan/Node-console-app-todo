require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
//MOSTAR MENÚ ES UNA OPCIÓN MANUAL... ANTES DE INQUIRE
// const {mostrarMenu, pausa} = require('./helpers/mensajes')
const { inquireMenu, inquirePausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoCheckList } = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();
    if (tareasDB) {
        //ESTABLECER LAS TAREAS
        tareas.cargarTareasFromArray(tareasDB);
    }
    do {
        console.clear();
        //IMPRIMIR EL MENU
        opt = await inquireMenu();
        // console.log({ opt });

        switch (opt) {
            case '1':
                //CREAR LA TAREA
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
                break;
            case '2':
                tareas.listadoCompleto();
                // console.log(tareas.listadoArr);
                break;
            case '3':
                tareas.listarPendientesCompletadas(true);
                break
            case '4': 
                tareas.listarPendientesCompletadas(false);
                break
            case '5'://completado || pendiente
                const ids = await mostrarListadoCheckList(tareas.listadoArr);
                // console.log(ids);
                tareas.toggleCompletadas(ids);
                break;
            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== '0') {
                    //TODO preguntar si esta seguro
                    const ok = await confirmar('¿Estas seguro de que desea borrarlo?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada')
                    }
                    // console.log(id);
                    // console.log(ok);
                }
                break
        }
        guardarDB(tareas.listadoArr);
        await inquirePausa();
    } while (opt !== '0');
}

main();