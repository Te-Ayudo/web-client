import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveModal, setActiveService } from '../../store/servicios';
import { setActiveItem, updateItem } from '../../store';
import useServiceCartRf from '../../hooks/useServiceCartRf';

export const Lista = ({servicio,showallicon=false,quantity=0,orden=''}) => {
  // const [cantidad, setCantidad] = useState(cant);
  const { changeQuantity } = useServiceCartRf();
  const { _id,imageURL,unitPrice,name,description } = servicio;
  const showicon = showallicon ?'':'hidden';
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onAddCart = () => {
    //dispatch( setActiveService( { _id,imageURL,unitPrice,name,description } ) );
    dispatch( setActiveService( servicio ) );
    dispatch( setActiveModal() );
  }


  return (
    <>
      <div className="flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4  border-l-transparent mb-5">
        <div className="w-2/3 bg-white flex flex-col space-y-2 p-3  inline-flex items-start space-x-2">
          <div className="text-slate-500 ">
            {" "}
            <strong>{name}</strong>{" "}
          </div>
          <div className="text-slate-500">
            {!!description ? description.substring(0, 85) : ""}
          </div>
          <div className="text-slate-500">
            <span>Desde</span> <strong> Bs. {unitPrice} </strong>
          </div>
        </div>
        <div>
          <img
            src={imageURL}
            alt=""
            width="70"
            height="70"
            className="flex-none rounded-md bg-slate-100"
          />

          <div className="mt-2 float-end align-center">
            {showallicon ? (
              <>
                <button type="button" className={`btn-icon  `}
                onClick={ () =>{
                    changeQuantity(orden, Number(orden.quantity) - 1)
                    }
                  }

                >
<svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4"/></svg>
                  <span className="sr-only">Icon description</span>
                </button>
                <span className=" mr-1.5 ">{ orden.quantity }</span>

                <button type="button" className="btn-icon"
                 onClick={ () => {
											changeQuantity(orden, Number(orden.quantity) + 1)
                  }
                }
                >
<svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 13h-8v8h-2v-8H3v-2h8V3h2v8h8z"/></svg>
                  <span className="sr-only">Icon description</span>
                </button>

              </>
            ) : (
                <button type="button" className="btn-icon"
                 onClick={
                  onAddCart
                }
                >
<svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 13h-8v8h-2v-8H3v-2h8V3h2v8h8z"/></svg>
                  <span className="sr-only">Icon description</span>
                </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
