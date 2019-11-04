let sess;
// exports.home = (req, res, next) => {
//     var successMsg = req.flash('success')[0];
//       res.render('home/index', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
//     };

    
exports.login= (req, res, next) => {
  res.redirect("/");
};
exports.quizmain=(req,res,next)=>{
  if(sess){
    res.redirect("/quizmain");
  } else{
    var successMsg = req.flash('success')[0];
    res.render('home/login', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
  }
};

exports.level=(req,res,nex)=>{

    var successMsg = req.flash('success')[0];
    res.render('home/level', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
 
}

exports.instructions=(req,res,nex)=>{
  
    var successMsg = req.flash('success')[0];
    res.render('home/instructions', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
 
}

exports.scores=(req,res,nex)=>{
  if(sess){
    var successMsg = req.flash('success')[0];
  res.render('home/scores', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
  } else{
    var successMsg = req.flash('success')[0];
    res.render('home/login', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
  }
}
