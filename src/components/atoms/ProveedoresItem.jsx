import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BOOKING_SET_PROVIDER, provider_set, startListSucursales } from "../../store";
import { branch_getall_request } from "../../store/branch/branchSlice";

export const ProveedoresItem = (item) => {
  const { selected } = useSelector((state) => state.booking);
  const { id, picture, first_name, avgRating } = item;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSelect = (item) => {
    dispatch(provider_set(item));
    dispatch(BOOKING_SET_PROVIDER(item));
    if (selected?.isInBranch) {
      dispatch(startListSucursales({ providerId: item._id }));
      const currentSlug = window.location.pathname.split("/")[1];
      navigate(`/${currentSlug}/sucursales`);
    }
  };

  return (
    <>
      <li key={id}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <article onClick={() => onSelect(item)} className="flex items-start space-x-6 cursor-pointer">
            <img src={picture} alt="" width="145" height="145" className="flex-none rounded-md bg-slate-100" />
            <div className="relative h-full flex flex-col justify-end">
              <h2 className="text-secondary">{first_name}</h2>
              <dl className="mt-2 flex text-sm leading-6 font-medium">
                <dt className="mr-3">
                  <span className="sr-only">Star rating</span>

                  <svg width="16" height="20" fill="#FF770F">
                    <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                  </svg>
                </dt>
                <dd className="font-semibold text-secondary">{avgRating}</dd>
              </dl>
            </div>
          </article>
          <div className="flex flex-col justify-end align-end "></div>
        </div>
      </li>
    </>
  );
};
