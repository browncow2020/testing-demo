import { TodosComponent } from './todos.component';
import { TodoService } from './todo.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService(null);
    component = new TodosComponent(service);
  });

  it('should set todos property with items returned from the service', () => {
    const todos = [1, 2, 3];

    spyOn(service, 'getTodos').and.callFake(() => {
      return Observable.from([ todos ]);
    })

    component.ngOnInit();

    // expect(component.todos.length).toBeGreaterThan(0);
    // expect(component.todos.length).toBe(3);
    expect(component.todos).toBe( todos );

  });

  it('should call the server to save the changes when a new todo item is added', () => {
    const spy = spyOn(service, 'add').and.callFake(() => {
      return Observable.empty();
    })

    component.add();

    expect(spy).toHaveBeenCalled();

  });

  it('should add the new todo returned from the server', () => {
    const todo = {id: 1};
    // const spy = spyOn(service, 'add').and.callFake(() => {
    //   return Observable.from([ todo ]);
    // })

    const spy = spyOn(service, 'add').and.returnValue(Observable.from([ todo ]));

    component.add();

    expect(component.todos.indexOf(todo)).toBeGreaterThan(-1);

  });

  it('should set the message property if server returns an error when adding a new todo ', () => {
    const error = 'error from the server';
    const spy = spyOn(service, 'add').and.returnValue(Observable.throw(error));

    component.add();

    expect(component.message).toBe(error);

  });


  it('should call the server to delete a todo item if the user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const spy = spyOn(service, 'delete').and.returnValue(Observable.empty());

    component.delete(1);

    expect(spy).toHaveBeenCalledWith(1);
  })

  it('should NOT call the server to delete a todo item if the user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const spy = spyOn(service, 'delete').and.returnValue(Observable.empty());

    component.delete(1);

    expect(spy).not.toHaveBeenCalledWith(1);
  })

});
