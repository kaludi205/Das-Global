using System.Web.Mvc;
using DasGlobal.Classes;
using DasGlobal.Repositories;

namespace DasGlobal.Controllers
{
    public partial class BaseController : Controller
    {
        protected UoWRepository   UoW;
        private   ResponseManager ResponseManager { get; }

        public BaseController()
        {
            UoW             = new UoWRepository();
            ResponseManager = new ResponseManager();
        }
    }
}