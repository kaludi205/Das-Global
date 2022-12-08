using System.Web.Mvc;

namespace DasGlobal.Controllers
{
	public class HomeController : BaseController
	{
		public ActionResult Index()
		{
			return View();
		}
	}
}